import { Component, inject, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent implements OnInit {
  @Input() isEditing = false;
  @Input() projectId: string | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<void>();
  @Output() projectUpdated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  projectForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(100)]]
  });

  searchEmailControl = new FormControl('');

  collaborators: { email: string; avatar: string }[] = [];
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit() {
    if (this.isEditing && this.projectId) {
      this.loadProjectForEdit(this.projectId);
    }
  }

  loadProjectForEdit(projectId: string) {
    // Aquí cargarías los datos del proyecto desde el servicio
    // Por ahora, simular con datos de ejemplo
    this.projectService.getProject(projectId).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description
        });
        // Cargar colaboradores si existen
        this.collaborators = project.collaborators || [];
      },
      error: (err) => {
        console.error('Error cargando proyecto:', err);
        this.errorMessage = 'Error al cargar el proyecto';
      }
    });
  }

  onSubmit() {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.errorMessage = '';
      this.successMessage = '';
      this.isSubmitting = true;

      const projectData = {
        ...this.projectForm.value,
        collaborators: this.collaborators
      };

      const operation = this.isEditing
        ? this.projectService.updateProject(Number(this.projectId), projectData)
        : this.projectService.createProject(projectData);

      operation.subscribe({
        next: (response) => {
          this.successMessage = this.isEditing ? 'Proyecto actualizado exitosamente' : response.message;
          
          setTimeout(() => {
            if (this.isEditing) {
              this.projectUpdated.emit();
            } else {
              this.projectCreated.emit();
            }
            this.close();
          }, 1500);
        },
        error: (err) => {
          console.error('Error:', err);
          this.isSubmitting = false;
          
          if (err.error?.error) {
            this.errorMessage = err.error.error;
          } else {
            this.errorMessage = `Error al ${this.isEditing ? 'actualizar' : 'crear'} el proyecto. Intenta nuevamente.`;
          }
        }
      });
    } else {
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
    }
  }

  addCollaborator() {
    const email = this.searchEmailControl.value?.trim();
    if (email && this.isValidEmail(email)) {
      if (!this.collaborators.find(c => c.email === email)) {
        this.collaborators.push({
          email: email,
          avatar: this.getAvatarInitials(email)
        });
        this.searchEmailControl.setValue('');
      }
    }
  }

  removeCollaborator(email: string) {
    this.collaborators = this.collaborators.filter(c => c.email !== email);
  }

  close() {
    this.closeModal.emit();
  }

  resetForm() {
    this.projectForm.reset();
    this.searchEmailControl.setValue('');
    this.collaborators = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getAvatarInitials(email: string): string {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  }

  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get descriptionLength() { return this.description?.value?.length || 0; }
}