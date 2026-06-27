import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { PatientDto, UpdatePatientDto } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  http = inject(HttpClient);

  getMyProfile() {
    return this.http.get<ApiResponse<PatientDto>>(
      `${environment.apiUrl}/Patients/my-profile`
    );
  }

  updateProfile(data: UpdatePatientDto) {
    return this.http.put<ApiResponse<PatientDto>>(
      `${environment.apiUrl}/Patients/profile`, data
    );
  }

  getAll() {
    return this.http.get<ApiResponse<PatientDto[]>>(
      `${environment.apiUrl}/Patients`
    );
  }
}