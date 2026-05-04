import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  ChangeTicketStatePayload,
  GetTicketsResponse,
  TicketResponse
} from '../../../shared/interfaces/ticket.interface';
 
const API_URL = 'http://localhost:3000/projects';
 
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
 
  /**
   * Obtiene todos los tickets de un proyecto
   * GET /projects/:projectId/tickets
   * Headers: Authorization: Bearer {token}
   * Retorna: { tickets: Ticket[] }
   */
  getTickets(projectId: number): Observable<GetTicketsResponse> {
    return this.http.get<GetTicketsResponse>(`${API_URL}/${projectId}/tickets`);
  }
 
  /**
   * Obtiene un ticket específico
   * GET /projects/:projectId/tickets/:ticketId
   * Headers: Authorization: Bearer {token}
   * Retorna: { ticket: Ticket }
   */
  getTicketById(projectId: number, ticketId: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${API_URL}/${projectId}/tickets/${ticketId}`);
  }
 
  /**
   * Crea un nuevo ticket
   * POST /projects/:projectId/tickets
   * Headers: Authorization: Bearer {token}
   * Body: { title: string, description: string, assignedUserId: number }
   * Retorna: { message: string, ticket: Ticket }
   */
  createTicket(projectId: number, data: CreateTicketPayload): Observable<{ message: string; ticket: Ticket }> {
    return this.http.post<{ message: string; ticket: Ticket }>(`${API_URL}/${projectId}/tickets`, data);
  }
 
  /**
   * Actualiza un ticket
   * PUT /projects/:projectId/tickets/:ticketId
   * Headers: Authorization: Bearer {token}
   * Body: { title?: string, description?: string, assignedUserId?: number }
   * Retorna: { message: string, ticket: Ticket }
   */
  updateTicket(projectId: number, ticketId: number, data: UpdateTicketPayload): Observable<{ message: string; ticket: Ticket }> {
    return this.http.put<{ message: string; ticket: Ticket }>(`${API_URL}/${projectId}/tickets/${ticketId}`, data);
  }
 
  /**
   * Cambia el estado de un ticket (para drag & drop en el Kanban)
   * PATCH /projects/:projectId/tickets/:ticketId/state
   * Headers: Authorization: Bearer {token}
   * Body: { state: 'pendiente' | 'progreso' | 'completado' }
   * Retorna: { message: string, ticket: Ticket }
   */
  changeTicketState(projectId: number, ticketId: number, data: ChangeTicketStatePayload): Observable<{ message: string; ticket: Ticket }> {
    return this.http.patch<{ message: string; ticket: Ticket }>(`${API_URL}/${projectId}/tickets/${ticketId}/state`, data);
  }
 
  /**
   * Elimina un ticket
   * DELETE /projects/:projectId/tickets/:ticketId
   * Headers: Authorization: Bearer {token}
   * Retorna: { message: string }
   */
  deleteTicket(projectId: number, ticketId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/${projectId}/tickets/${ticketId}`);
  }
}
