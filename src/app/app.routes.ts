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
      import('./features/projects/components/project-list/project-list.component').then((m) => m.ProjectListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId',
    loadComponent: () =>
      import('./features/projects/components/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/tickets',
    loadComponent: () =>
      import('./features/tickets/pages/tickets-board.component').then((m) => m.TicketsBoardComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' },
];
