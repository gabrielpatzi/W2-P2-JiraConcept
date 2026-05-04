import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectWithStatus, ProjectStatus } from '../../../../shared/interfaces/project.interface';
 
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);
 
  projects: ProjectWithStatus[] = [];
  filteredProjects: ProjectWithStatus[] = [];
  searchTerm = '';
  showCreateModal = false;
  viewMode: 'grid' | 'list' = 'grid';
 
  // Colores para los avatares de proyectos
  private avatarColors = ['#E8EAF6', '#E1F5DC', '#FFF4E6', '#FCE4EC'];
 
  ngOnInit() {
    this.loadProjects();
  }
 
  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (response) => {
        // Combinar proyectos propios y colaborativos
        const allProjects = [
          ...response.ownerProjects,
          ...response.colabProjects
        ];
 
        // Enriquecer con datos adicionales para la UI
        this.projects = allProjects.map((project, index) => ({
          ...project,
          status: this.getRandomStatus(),
          memberCount: Math.floor(Math.random() * 5) + 1, // Placeholder
          ticketCount: Math.floor(Math.random() * 10) + 3, // Placeholder
          avatarColor: this.avatarColors[index % this.avatarColors.length]
        }));
 
        this.filteredProjects = this.projects;
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        alert('Error al cargar los proyectos');
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
    this.showCreateModal = true;
  }
 
  closeCreateModal() {
    this.showCreateModal = false;
  }
 
  viewProjectDetails(projectId: number) {
    // Por ahora solo navega, después implementaremos el modal de detalles
    console.log('Ver detalles del proyecto:', projectId);
  }
 
  editProject(projectId: number) {
    // Por ahora solo log, después implementaremos el modal de edición
    console.log('Editar proyecto:', projectId);
  }
 
  viewTickets(projectId: number) {
    // Navegar al tablero de tickets de este proyecto
    this.router.navigate(['/projects', projectId, 'tickets']);
  }
 
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
 
  getProjectInitials(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
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
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  }
}