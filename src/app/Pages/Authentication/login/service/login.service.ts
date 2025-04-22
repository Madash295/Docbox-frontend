import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { baseURL } from '../../../../../app/environments/dev_baseURL';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = baseURL.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ role: string; token: string }> {
    return this.http.post<{ role: string; token: string }>(`${this.apiUrl}/auth/login`, { email, password });
  }
  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

}
