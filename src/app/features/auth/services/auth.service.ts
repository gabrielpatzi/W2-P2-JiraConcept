import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginPayload, RegisterPayload, AuthResponse } from '../../../shared/interfaces/auth.interface'; // Ajusta la ruta a tus interfaces

const API_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  

  login(credentials: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, credentials).pipe(
      tap(response => localStorage.setItem('token', response.sessionToken))
    );
  }

    register(data: RegisterPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_URL}/register`, data);
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}