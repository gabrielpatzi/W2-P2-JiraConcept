import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { ProjectService } from '../../projects/services/project.service';
import { Ticket, TicketState, KanbanColumn } from '../../../shared/interfaces/ticket.interface';

@Component({
  selector: 'app-tickets-board',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './tickets-board.component.html',
  styleUrl: './tickets-board.component.css'
})
export class TicketsBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projectId!: number;
  projectName = '';
  projectMembers: any[] = [];
  
  isLoading = signal(true);
  alertMessage = signal('');
  alertType = signal<'success' | 'error'>('success');

  columns: KanbanColumn[] = [
    { id: 'pendiente', title: 'Pendiente', tickets: [] },
    { id: 'progreso', title: 'En Progreso', tickets: [] },
    { id: 'completado', title: 'Completado', tickets: [] },
  ];

  // Modal state
  showTicketModal = false;
  isEditMode = false;
  isSubmitting = false;
  selectedTicket: Ticket | null = null;
  modalError = '';

  ticketForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    assignedUserId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
  });

  // Ticket detail modal
  showDetailModal = false;
  detailTicket: Ticket | null = null;

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.loadProjectInfo();
    this.loadTickets();
  }

  loadProjectInfo() {
    this.projectService.getProject(this.projectId).subscribe({
      next: (res) => {
        this.projectName = res.projectDetails?.name || `Proyecto #${this.projectId}`;
        this.projectMembers = res.projectMembers || [];
      },
      error: () => { this.projectName = `Proyecto #${this.projectId}`; }
    });
  }

  loadTickets() {
    this.isLoading.set(true);
    this.ticketService.getTickets(this.projectId).subscribe({
      next: (res) => {
        this.columns.forEach(col => col.tickets = []);
        res.tickets.forEach(ticket => {
          const col = this.columns.find(c => c.id === ticket.state);
          if (col) col.tickets.push(ticket);
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.showAlert('Error al cargar los tickets', 'error');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedTicket = null;
    this.ticketForm.reset();
    this.modalError = '';
    this.showTicketModal = true;
  }

  openEditModal(ticket: Ticket) {
    this.isEditMode = true;
    this.selectedTicket = ticket;
    this.ticketForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      assignedUserId: ticket.assignedUserId
    });
    this.modalError = '';
    this.showTicketModal = true;
  }

  closeTicketModal() {
    this.showTicketModal = false;
    this.selectedTicket = null;
    this.modalError = '';
  }

  onSubmitTicket() {
    if (this.ticketForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.modalError = '';

    const payload = {
      title: this.ticketForm.value.title,
      description: this.ticketForm.value.description,
      assignedUserId: Number(this.ticketForm.value.assignedUserId)
    };

    const op = this.isEditMode
      ? this.ticketService.updateTicket(this.projectId, this.selectedTicket!.ticketId, payload)
      : this.ticketService.createTicket(this.projectId, payload);

    op.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeTicketModal();
        this.showAlert(this.isEditMode ? 'Ticket actualizado' : 'Ticket creado', 'success');
        this.loadTickets();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.modalError = err.error?.error || `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el ticket`;
      }
    });
  }

  changeState(ticket: Ticket, newState: TicketState) {
    if (ticket.state === newState) return;
    this.ticketService.changeTicketState(this.projectId, ticket.ticketId, { state: newState }).subscribe({
      next: () => {
        this.showAlert('Estado actualizado', 'success');
        this.loadTickets();
      },
      error: (err) => this.showAlert(err.error?.error || 'Error al cambiar estado', 'error')
    });
  }

  deleteTicket(ticket: Ticket) {
    if (!confirm(`¿Eliminar el ticket "${ticket.title}"?`)) return;
    this.ticketService.deleteTicket(this.projectId, ticket.ticketId).subscribe({
      next: () => {
        this.showAlert('Ticket eliminado', 'success');
        this.loadTickets();
      },
      error: (err) => this.showAlert(err.error?.error || 'Error al eliminar', 'error')
    });
  }

  openDetail(ticket: Ticket) {
    this.detailTicket = ticket;
    this.showDetailModal = true;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.detailTicket = null;
  }

  getMemberName(userId: number): string {
    const m = this.projectMembers.find(m => m.userId === userId);
    return m ? m.name : `Usuario #${userId}`;
  }

  getNextStates(current: TicketState): { state: TicketState; label: string }[] {
    const all: { state: TicketState; label: string }[] = [
      { state: 'pendiente', label: 'Pendiente' },
      { state: 'progreso', label: 'En Progreso' },
      { state: 'completado', label: 'Completado' },
    ];
    return all.filter(s => s.state !== current);
  }

  goBack() {
    this.router.navigate(['/projects', this.projectId]);
  }

  formatDate(d: string) {
    if (!d) return '';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  private showAlert(msg: string, type: 'success' | 'error') {
    this.alertMessage.set(msg);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(''), 3500);
  }

  get totalTickets() { return this.columns.reduce((s, c) => s + c.tickets.length, 0); }
  get descLength() { return this.ticketForm.get('description')?.value?.length || 0; }
  
  columnColors: Record<string, string> = {
    pendiente: '#F59E0B',
    progreso: '#3B82F6',
    completado: '#10B981'
  };

  columnBg: Record<string, string> = {
    pendiente: '#FFFBEB',
    progreso: '#EFF6FF',
    completado: '#ECFDF5'
  };
}
