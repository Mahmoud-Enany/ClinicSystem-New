import { LoadingSpinner } from './../../../shared/loading-spinner/loading-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpecialtyDto } from './../../../../interfaces/specialty.interface';
import { DoctorDto } from './../../../../interfaces/doctor.interface';
import { SpecialtyService } from './../../../../services/specialty.service';
import { DoctorService } from './../../../../services/doctor.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-doctors-list',
  imports: [RouterLink, LoadingSpinner, DecimalPipe, ReactiveFormsModule],
  templateUrl: './doctors-list.html',
  styleUrl: './doctors-list.css',
})
export class DoctorsList implements OnInit {
  doctorService = inject(DoctorService);
  specialtyService = inject(SpecialtyService);
  route = inject(ActivatedRoute);

  doctors = signal<DoctorDto[]>([]);
  filteredDoctors = signal<DoctorDto[]>([]);
  specialties = signal<SpecialtyDto[]>([]);
  isLoading = signal(true);
  selectedSpecialty = signal(0);

  searchControl = new FormControl('');

  ngOnInit() {
    this.loadSpecialties();
    this.loadDoctors();

    this.searchControl.valueChanges.subscribe(() => 
      {
      this.filterDoctors();
    });

    this.route.queryParams.subscribe(params => 
      {
      if (params['specialty']) 
      {
        this.selectedSpecialty.set(+params['specialty']);
        this.filterDoctors();
      }
    });
  }

  loadSpecialties() {
    this.specialtyService.getAll().subscribe({
      next: (res) => this.specialties.set(res.data),
      error: (err) => console.error(err)
    });
  }

  loadDoctors() {
    this.doctorService.getAll().subscribe({
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

  filterBySpecialty(specialtyId: number) {
    this.selectedSpecialty.set(specialtyId);
    this.filterDoctors();
  }

  filterDoctors() {
    let result = this.doctors();
    const search = this.searchControl.value?.toLowerCase() || '';
    const specialty = this.selectedSpecialty();

    if (specialty > 0) {
      result = result.filter(d => d.specialtyId === specialty);
    }

    if (search) {
      result = result.filter(d =>
        d.fullName.toLowerCase().includes(search) ||
        d.specialtyName.toLowerCase().includes(search)
      );
    }

    this.filteredDoctors.set(result);
  }
}
