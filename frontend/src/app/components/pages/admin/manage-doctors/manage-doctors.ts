import { environment } from './../../../../../environments/environment';
import { ApiResponse } from './../../../../interfaces/api-response.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DoctorDto } from './../../../../interfaces/doctor.interface';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from './../../../../services/doctor.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-manage-doctors',
  imports: [LoadingSpinner,ReactiveFormsModule,DecimalPipe],
  templateUrl: './manage-doctors.html',
  styleUrl: './manage-doctors.css',
})

export class ManageDoctors implements OnInit {
  doctorService = inject(DoctorService);
  http = inject(HttpClient);

  doctors = signal<DoctorDto[]>([]);
  filteredDoctors = signal<DoctorDto[]>([]);
  isLoading = signal(true);
  togglingId = signal<number | null>(null);
  successMessage = signal('');

  searchControl = new FormControl('');

  ngOnInit() {
    this.loadDoctors();
    this.searchControl.valueChanges.subscribe(() => this.filterDoctors());
  }

  loadDoctors() {
    this.http.get<ApiResponse<DoctorDto[]>>(
      `${environment.apiUrl}/Admin/doctors`
    ).subscribe({
      next: (res) => {
        this.doctors.set(res.data);
        this.filteredDoctors.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  filterDoctors() {
    const search = this.searchControl.value?.toLowerCase() || '';
    if (!search) {
      this.filteredDoctors.set(this.doctors());
      return;
    }
    this.filteredDoctors.set(
      this.doctors().filter(d =>
        d.fullName.toLowerCase().includes(search) ||
        d.specialtyName.toLowerCase().includes(search) ||
        d.email.toLowerCase().includes(search)
      )
    );
  }

  toggleAvailability(doctorId: number) {
    this.togglingId.set(doctorId);
    this.http.put<ApiResponse<string>>(
      `${environment.apiUrl}/Admin/doctors/${doctorId}/toggle`, {}
    ).subscribe({
      next: (res) => {
        this.togglingId.set(null);
        this.successMessage.set(res.data);
        this.loadDoctors();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.togglingId.set(null);
        console.error(err);
      }
    });
  }
}

