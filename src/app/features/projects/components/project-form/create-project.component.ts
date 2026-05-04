import { Component, inject, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    description: ['', [Validators.maxLength(100)]]
  });

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit() {
    if (this.isEditing && this.projectId) {
      this.loadProjectForEdit(this.projectId);
    }
  }

  loadProjectForEdit(projectId: string) {
    this.projectService.getProject(projectId).subscribe({
      next: (project) => {
        const projectData = project.projectDetails || project;
        this.projectForm.patchValue({
          name: projectData.name,
          description: projectData.description
        });
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
        ...this.projectForm.value
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

  close() {
    this.closeModal.emit();
  }

  resetForm() {
    this.projectForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }

  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get descriptionLength() { return this.description?.value?.length || 0; }
}