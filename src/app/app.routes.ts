import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/pages/projects.component').then((m) => m.ProjectsComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' },
];
