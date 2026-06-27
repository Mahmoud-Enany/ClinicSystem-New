import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
// import { environment } from '../environments/environment';
import { AuthResponse, LoginDto, RegisterDto } from '../interfaces/auth.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  isLoggedIn = signal(false);
  role = signal('');
  fullName = signal('');

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn.set(true);
      this.role.set(localStorage.getItem('role') || '');
      this.fullName.set(localStorage.getItem('fullName') || '');
    }
  }

  login(data: LoginDto) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/Auth/login`, data)
    .pipe(tap((res) => 
      {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('fullName', res.data.fullName);
        this.isLoggedIn.set(true);
        this.role.set(res.data.role);
        this.fullName.set(res.data.fullName);
      })
    );
  }

  register(data: RegisterDto) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/Auth/register`, data)
    .pipe(tap((res) => 
      {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('fullName', res.data.fullName);
        this.isLoggedIn.set(true);
        this.role.set(res.data.role);
        this.fullName.set(res.data.fullName);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    this.isLoggedIn.set(false);
    this.role.set('');
    this.fullName.set('');
  }

}