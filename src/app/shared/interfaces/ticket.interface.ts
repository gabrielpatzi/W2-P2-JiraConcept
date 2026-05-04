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
 
export interface ChangeTicketStatePayload {
  state: TicketState;
}
 
export interface GetTicketsResponse {
  tickets: Ticket[];
}
 
export interface TicketResponse {
  ticket: Ticket;
}
 
// Para el tablero Kanban
export interface KanbanColumn {
  id: TicketState;
  title: string;
  tickets: Ticket[];
}
 
