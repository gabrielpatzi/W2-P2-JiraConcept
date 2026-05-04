import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Project, 
  CreateProjectPayload, 
  UpdateProjectPayload,
  GetProjectsResponse 
} from '../../../shared/interfaces/project.interface';
import { User } from '../../../shared/interfaces';

const API_URL = 'http://localhost:3000/projects';
 
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
 
  getProjects(): Observable<GetProjectsResponse> {
    return this.http.get<GetProjectsResponse>(API_URL);
  }
 
  getProject(projectId: string | number): Observable<any> {
    return this.http.get<any>(`${API_URL}/${projectId}`);
  }
 
  updateProject(projectId: number, data: UpdateProjectPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${API_URL}/${projectId}`, data);
  }

  createProject(data: CreateProjectPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API_URL, data);
  }
 
  addProjectMember(projectId: number, memberId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_URL}/${projectId}/member/${memberId}`, {});
  }

  getAvailableUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/users/available`);
  }

  removeProjectMember(projectId: number, memberId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/${projectId}/member/${memberId}`);
  }
}
