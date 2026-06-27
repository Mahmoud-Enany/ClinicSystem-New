import { DoctorDto } from './../../../interfaces/doctor.interface';
import { SpecialtyDto } from './../../../interfaces/specialty.interface';
import { DoctorService } from './../../../services/doctor.service';
import { SpecialtyService } from './../../../services/specialty.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [LoadingSpinner,RouterLink,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home  implements OnInit 
{
  specialtyService = inject(SpecialtyService);
  doctorService = inject(DoctorService);

  specialties = signal<SpecialtyDto[]>([]);
  doctors = signal<DoctorDto[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.specialtyService.getAll().subscribe({
      next: (res) => this.specialties.set(res.data),
      error: (err) => console.error(err)
    });

    this.doctorService.getAll().subscribe({
      next: (res) => {
        this.doctors.set(res.data.slice(0, 6));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}

 

