import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';
import { ApiResponse } from './../../../../interfaces/api-response.interface';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { RouterLink } from '@angular/router';

interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalSpecialties: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}



@Component({
  selector: 'app-dashboard',
  imports: [LoadingSpinner,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  http = inject(HttpClient);

  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.http.get<ApiResponse<DashboardStats>>(
      `${environment.apiUrl}/Admin/dashboard`
    ).subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}