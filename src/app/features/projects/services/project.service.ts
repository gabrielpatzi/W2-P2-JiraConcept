import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Project, 
  CreateProjectPayload, 
  UpdateProjectPayload,
  GetProjectsResponse 
} from '../../../shared/interfaces/project.interface';
 
const API_URL = 'http://localhost:3000/projects';
 
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
 
  /**
   * Obtiene todos los proyectos del usuario (owner y colaborador)
   * GET /projects
   * Headers: Authorization: Bearer {token}
   * Retorna: { ownerProjects: Project[], colabProjects: Project[] }
   */
  getProjects(): Observable<GetProjectsResponse> {
    return this.http.get<GetProjectsResponse>(API_URL);
  }
 
  /**
   * Obtiene un proyecto específico por ID
   * GET /projects/:projectId
   * Headers: Authorization: Bearer {token}
   * Retorna: Project
   */
  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${API_URL}/${projectId}`);
  }
 
  /**
   * Actualiza un proyecto existente (solo el owner puede hacerlo)
   * PUT /projects/:projectId
   * Headers: Authorization: Bearer {token}
   * Body: { name: string, description: string }
   * Retorna: { message: string }
   */
  updateProject(projectId: number, data: UpdateProjectPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${API_URL}/${projectId}`, data);
  }



  createProject(data: CreateProjectPayload): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(API_URL, data);
}
 
  /**
   * Agrega un miembro al proyecto
   * POST /projects/:projectId/member/:memberId
   * Headers: Authorization: Bearer {token}
   * Retorna: { message: string }
   */
  addProjectMember(projectId: number, memberId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_URL}/${projectId}/member/${memberId}`, {});
  }
}
