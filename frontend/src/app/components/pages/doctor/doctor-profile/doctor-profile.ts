import { LoadingSpinner } from './../../../shared/loading-spinner/loading-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpecialtyDto } from './../../../../interfaces/specialty.interface';
import { DoctorDto } from './../../../../interfaces/doctor.interface';
import { AuthService } from './../../../../services/auth.service';
import { SpecialtyService } from './../../../../services/specialty.service';
import { DoctorService } from './../../../../services/doctor.service';
import { Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-doctor-profile',
  imports: [ReactiveFormsModule,LoadingSpinner],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})

export class DoctorProfile implements OnInit {
  doctorService = inject(DoctorService);
  specialtyService = inject(SpecialtyService);
  authService = inject(AuthService);

  doctor = signal<DoctorDto | null>(null);
  specialties = signal<SpecialtyDto[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);
  isNewProfile = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  profileForm = new FormGroup({
    specialtyId: new FormControl(0, [Validators.required, Validators.min(1)]),
    title: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    consultationFee: new FormControl(0, [Validators.required, Validators.min(1)]),
    experienceYears: new FormControl(0, [Validators.required, Validators.min(0)]),
    clinicAddress: new FormControl(''),
    isAvailable: new FormControl(true)
  });

  ngOnInit() {
    this.loadSpecialties();
    this.loadProfile();
  }

  loadSpecialties() {
    this.specialtyService.getAll().subscribe({
      next: (res) => this.specialties.set(res.data),
      error: (err) => console.error(err)
    });
  }

  loadProfile() {
    this.doctorService.getMyProfile().subscribe({
      next: (res) => {
        this.doctor.set(res.data);
        this.profileForm.patchValue({
          specialtyId: res.data.specialtyId,
          title: res.data.title,
          bio: res.data.bio || '',
          consultationFee: res.data.consultationFee,
          experienceYears: res.data.experienceYears,
          clinicAddress: res.data.clinicAddress || '',
          isAvailable: res.data.isAvailable
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.isNewProfile.set(true);
          this.isEditing.set(true);
        }
        this.isLoading.set(false);
      }
    });
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const data = this.profileForm.value as any;

    if (this.isNewProfile()) {
      this.doctorService.createProfile(data).subscribe({
        next: (res) => {
          this.doctor.set(res.data);
          this.isSaving.set(false);
          this.isEditing.set(false);
          this.isNewProfile.set(false);
          this.successMessage.set('Profile created successfully!');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set('Failed to create profile.');
        }
      });
    } else {
      this.doctorService.updateProfile(data).subscribe({
        next: (res) => {
          this.doctor.set(res.data);
          this.isSaving.set(false);
          this.isEditing.set(false);
          this.successMessage.set('Profile updated successfully!');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set('Failed to update profile.');
        }
      });
    }
  }
}
