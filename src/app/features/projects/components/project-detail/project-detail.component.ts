import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../shared/interfaces';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projectId!: number;
  projectDetails: any = null;
  projectMembers: any[] = [];
  availableUsers: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  selectedUser: User | null = null;
  isLoadingUsers = false;
  usersLoadError = '';

  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  showAddMemberModal = false;
  isAddingMember = false;
  addMemberError = '';

  addMemberForm: FormGroup = this.fb.group({
    memberId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
  });

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.loadProject();
  }

  loadProject() {
    this.isLoading.set(true);
    this.projectService.getProject(this.projectId).subscribe({
      next: (response) => {
        this.projectDetails = response.projectDetails;
        this.projectMembers = response.projectMembers || [];
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando proyecto:', err);
        this.errorMessage.set('No tienes acceso a este proyecto o no existe.');
        this.isLoading.set(false);
      }
    });
  }

  openAddMemberModal() {
    this.addMemberForm.reset();
    this.selectedUser = null;
    this.searchQuery = '';
    this.availableUsers = [];
    this.filteredUsers = [];
    this.usersLoadError = '';
    this.addMemberError = '';
    this.showAddMemberModal = true;
    this.loadAvailableUsers();
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
    this.addMemberError = '';
  }

  loadAvailableUsers() {
    this.isLoadingUsers = true;
    this.projectService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.filteredUsers = [...users];
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios disponibles:', error);
        this.usersLoadError = 'No se pudieron cargar los usuarios disponibles. Intenta de nuevo.';
        this.isLoadingUsers = false;
      }
    });
  }

  filterUsers() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredUsers = [...this.availableUsers];
      return;
    }

    this.filteredUsers = this.availableUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.addMemberForm.patchValue({ memberId: user.userId });
  }

  onAddMember() {
    if (this.addMemberForm.valid && !this.isAddingMember) {
      if (!this.selectedUser) {
        this.addMemberError = 'Selecciona un usuario de la lista para agregarlo.';
        return;
      }

      this.isAddingMember = true;
      this.addMemberError = '';
      const memberId = this.selectedUser.userId;
      
      this.projectService.addProjectMember(this.projectId, memberId).subscribe({
        next: () => {
          this.isAddingMember = false;
          this.closeAddMemberModal();
          this.successMessage.set('Miembro agregado exitosamente');
          this.loadProject();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => {
          this.isAddingMember = false;
          this.addMemberError = err.error?.message || err.error?.error || 'Error al agregar el miembro';
        }
      });
    }
  }

  removeMember(memberId: number) {
    if (!confirm('¿Estás seguro de que quieres remover este miembro?')) return;
    
    this.projectService.removeProjectMember(this.projectId, memberId).subscribe({
      next: () => {
        this.successMessage.set('Miembro removido exitosamente');
        this.loadProject();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al remover el miembro');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  goToTickets() {
    this.router.navigate(['/projects', this.projectId, 'tickets']);
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  getInitials(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
