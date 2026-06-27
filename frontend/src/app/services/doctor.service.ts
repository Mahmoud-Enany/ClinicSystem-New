import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { DoctorDto, CreateDoctorDto, UpdateDoctorDto } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  http = inject(HttpClient);

  getAll() {
    return this.http.get<ApiResponse<DoctorDto[]>>(
      `${environment.apiUrl}/Doctors`
    );
  }

  getById(id: number) {
    return this.http.get<ApiResponse<DoctorDto>>(
      `${environment.apiUrl}/Doctors/${id}`
    );
  }

  getBySpecialty(specialtyId: number) {
    return this.http.get<ApiResponse<DoctorDto[]>>(
      `${environment.apiUrl}/Doctors/specialty/${specialtyId}`
    );
  }

  getMyProfile() {
    return this.http.get<ApiResponse<DoctorDto>>(
      `${environment.apiUrl}/Doctors/my-profile`
    );
  }

  createProfile(data: CreateDoctorDto) {
    return this.http.post<ApiResponse<DoctorDto>>(
      `${environment.apiUrl}/Doctors/profile`, data
    );
  }

  updateProfile(data: UpdateDoctorDto) {
    return this.http.put<ApiResponse<DoctorDto>>(
      `${environment.apiUrl}/Doctors/profile`, data
    );
  }
}