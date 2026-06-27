import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { MedicalRecordDto, CreateMedicalRecordDto } from '../interfaces/medical-record.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  http = inject(HttpClient);

  getMyRecords() {
    return this.http.get<ApiResponse<MedicalRecordDto[]>>(
      `${environment.apiUrl}/MedicalRecords/my`
    );
  }

  getPatientRecords(patientId: number) {
    return this.http.get<ApiResponse<MedicalRecordDto[]>>(
      `${environment.apiUrl}/MedicalRecords/patient/${patientId}`
    );
  }

  create(data: CreateMedicalRecordDto) {
    return this.http.post<ApiResponse<MedicalRecordDto>>(
      `${environment.apiUrl}/MedicalRecords`, data
    );
  }
}