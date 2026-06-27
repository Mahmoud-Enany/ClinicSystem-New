import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { SpecialtyDto, CreateSpecialtyDto } from '../interfaces/specialty.interface';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {

  http = inject(HttpClient);

  getAll() {
    return this.http.get<ApiResponse<SpecialtyDto[]>>(
      `${environment.apiUrl}/Specialties`
    );
  }

  getById(id: number) {
    return this.http.get<ApiResponse<SpecialtyDto>>(
      `${environment.apiUrl}/Specialties/${id}`
    );
  }

  create(data: CreateSpecialtyDto) {
    return this.http.post<ApiResponse<SpecialtyDto>>(
      `${environment.apiUrl}/Specialties`, data
    );
  }

  update(id: number, data: CreateSpecialtyDto) {
    return this.http.put<ApiResponse<SpecialtyDto>>(
      `${environment.apiUrl}/Specialties/${id}`, data
    );
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<string>>(
      `${environment.apiUrl}/Specialties/${id}`
    );
  }
}