export interface Project {
  projectId: number;
  name: string;
  description: string;
  ownerId: number;
  created_at: string;
  updated_at: string;
  collaborators?: { email: string; avatar: string }[];
}
 
export interface CreateProjectPayload {
  name: string;
  description: string;
  collaborators?: { email: string; avatar: string }[];
}
 
export interface UpdateProjectPayload {
  name: string;
  description: string;
  collaborators?: { email: string; avatar: string }[];
}
 
export interface GetProjectsResponse {
  ownerProjects: Project[];
  colabProjects: Project[];
}
 
// Estados para la UI
export type ProjectStatus = 'IN PROGRESS' | 'ON TRACK' | 'AT RISK' | 'PLANNING' | 'COMPLETED';
 
// Interfaz extendida para la UI con datos adicionales
export interface ProjectWithStatus extends Project {
  status?: ProjectStatus;
  memberCount?: number;
  ticketCount?: number;
  avatarColor?: string;
}
