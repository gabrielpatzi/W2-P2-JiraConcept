import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectWithStatus, ProjectStatus } from '../../../../shared/interfaces/project.interface';
import { CreateProjectComponent } from '../project-form/create-project.component';
import { AuthService } from '../../../auth/services/auth.service';
 
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, CreateProjectComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);
 
  projects: ProjectWithStatus[] = [];
  filteredProjects: ProjectWithStatus[] = [];
  searchTerm = '';
  showCreateModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedProjectId: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
 
  private avatarColors = ['#E8EAF6', '#E1F5DC', '#FFF4E6', '#FCE4EC', '#E0F2FE', '#FDF4FF'];
 
  ngOnInit() {
    this.loadProjects();
  }
 
  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (response) => {
        const allProjects = [
          ...response.ownerProjects.map(p => ({ ...p, isOwner: true })),
          ...response.colabProjects.map(p => ({ ...p, isOwner: false }))
        ];
 
        this.projects = allProjects.map((project, index) => ({
          ...project,
          status: this.getRandomStatus(),
          avatarColor: this.avatarColors[index % this.avatarColors.length]
        }));
 
        this.filteredProjects = this.projects;
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
      }
    });
  }
 
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(this.searchTerm) ||
      project.description.toLowerCase().includes(this.searchTerm)
    );
  }
 
  openCreateModal() {
    this.modalMode = 'create';
    this.selectedProjectId = null;
    this.showCreateModal = true;
  }
 
  closeCreateModal() {
    this.showCreateModal = false;
    this.selectedProjectId = null;
  }
 
  viewProjectDetails(projectId: number) {
    this.router.navigate(['/projects', projectId]);
  }
 
  editProject(projectId: number) {
    this.modalMode = 'edit';
    this.selectedProjectId = projectId.toString();
    this.showCreateModal = true;
  }
 
  onProjectSaved() {
    this.closeCreateModal();
    this.loadProjects();
  }
 
  viewTickets(projectId: number) {
    this.router.navigate(['/projects', projectId, 'tickets']);
  }
 
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
 
  getProjectInitials(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
 
  getStatusClass(status?: ProjectStatus): string {
    switch (status) {
      case 'IN PROGRESS': return 'badge-blue';
      case 'ON TRACK': return 'badge-green';
      case 'AT RISK': return 'badge-orange';
      case 'PLANNING': return 'badge-purple';
      case 'COMPLETED': return 'badge-gray';
      default: return 'badge-gray';
    }
  }
 
  private getRandomStatus(): ProjectStatus {
    const statuses: ProjectStatus[] = ['IN PROGRESS', 'ON TRACK', 'AT RISK', 'PLANNING'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
 
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
