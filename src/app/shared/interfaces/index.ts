

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  userId: number;
  name: string;
  email: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  projectId: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  ownerProjects: Project[];
  colabProjects: Project[];
}

export interface CreateProjectPayload {
  name: string;
  description: string;
}

// ─── Ticket ──────────────────────────────────────────────────────────────────

export type TicketState = 'pendiente' | 'progreso' | 'completado';

export interface Ticket {
  ticketId: number;
  projectId: number;
  title: string;
  description: string;
  state: TicketState;
  assignedUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsResponse {
  tickets: Ticket[];
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  assignedUserId: number;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  assignedUserId?: number;
}

export interface ChangeStatePayload {
  state: TicketState;
}

// ─── Board helpers ───────────────────────────────────────────────────────────

export interface BoardColumns {
  pendiente: Ticket[];
  progreso: Ticket[];
  completado: Ticket[];
}

export const TICKET_STATE_LABELS: Record<TicketState, string> = {
  pendiente: 'Pendiente',
  progreso: 'En Progreso',
  completado: 'Completado',
};

export const ALLOWED_TRANSITIONS: Record<TicketState, TicketState[]> = {
  pendiente: ['progreso'],
  progreso: ['pendiente', 'completado'],
  completado: ['progreso'],
};
