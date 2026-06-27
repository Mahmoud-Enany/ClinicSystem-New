import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ScheduleDto, CreateScheduleDto } from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  http = inject(HttpClient);

  getMySchedules() {
    return this.http.get<ApiResponse<ScheduleDto[]>>(
      `${environment.apiUrl}/Schedules/my`
    );
  }

  getDoctorSchedules(doctorId: number) {
    return this.http.get<ApiResponse<ScheduleDto[]>>(
      `${environment.apiUrl}/Schedules/doctor/${doctorId}`
    );
  }

  getAvailableSlots(doctorId: number, date: string) {
    return this.http.get<ApiResponse<string[]>>(
      `${environment.apiUrl}/Schedules/slots/${doctorId}?date=${date}`
    );
  }

  create(data: CreateScheduleDto) {
    return this.http.post<ApiResponse<ScheduleDto>>(
      `${environment.apiUrl}/Schedules`, data
    );
  }

  update(id: number, data: CreateScheduleDto) {
    return this.http.put<ApiResponse<ScheduleDto>>(
      `${environment.apiUrl}/Schedules/${id}`, data
    );
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<string>>(
      `${environment.apiUrl}/Schedules/${id}`
    );
  }
}