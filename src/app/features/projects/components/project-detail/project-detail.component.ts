import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    this.addMemberError = '';
    this.showAddMemberModal = true;
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
    this.addMemberError = '';
  }

  onAddMember() {
    if (this.addMemberForm.valid && !this.isAddingMember) {
      this.isAddingMember = true;
      this.addMemberError = '';
      const memberId = Number(this.addMemberForm.value.memberId);
      
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
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
