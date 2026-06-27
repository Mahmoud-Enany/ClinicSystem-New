import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { AppointmentDto, BookAppointmentDto, UpdateAppointmentDto } from '../interfaces/appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  http = inject(HttpClient);

  getMyAppointments() {
    return this.http.get<ApiResponse<AppointmentDto[]>>(
      `${environment.apiUrl}/Appointments/my`
    );
  }

  getAll() {
    return this.http.get<ApiResponse<AppointmentDto[]>>(
      `${environment.apiUrl}/Appointments`
    );
  }

  book(data: BookAppointmentDto) {
    return this.http.post<ApiResponse<AppointmentDto>>(
      `${environment.apiUrl}/Appointments`, data
    );
  }

  cancel(id: number, reason: string) {
    return this.http.put<ApiResponse<string>>(
      `${environment.apiUrl}/Appointments/${id}/cancel`, JSON.stringify(reason),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateStatus(id: number, data: UpdateAppointmentDto) {
    return this.http.put<ApiResponse<AppointmentDto>>(
      `${environment.apiUrl}/Appointments/${id}/status`, data
    );
  }
}