import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Mis Proyectos</h2>
            <button class="btn btn-danger" (click)="logout()">Cerrar Sesión</button>
          </div>
          
          <div class="alert alert-info">
            ¡Bienvenido! Esta es la página de proyectos. Aquí irán tus proyectos cuando implemente la lógica.
          </div>

          <div class="card">
            <div class="card-body">
              <p class="text-muted">No hay proyectos todavía.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
    }
  `]
})
export class ProjectsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
