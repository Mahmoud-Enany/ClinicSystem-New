import { DoctorDto } from './../../../../interfaces/doctor.interface';
import { AuthService } from './../../../../services/auth.service';
import { DoctorService } from './../../../../services/doctor.service';
import { LoadingSpinner } from './../../../shared/loading-spinner/loading-spinner';
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-details',
  imports: [RouterLink,DecimalPipe,LoadingSpinner],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css',
})
export class DoctorDetails implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  doctorService = inject(DoctorService);
  authService = inject(AuthService);

  doctor = signal<DoctorDto | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadDoctor(id);
  }

  loadDoctor(id: number) {
    this.doctorService.getById(id).subscribe({
      next: (res) => {
        this.doctor.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  bookAppointment() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/book', this.doctor()?.id]);
  }
}

