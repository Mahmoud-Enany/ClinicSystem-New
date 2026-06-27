import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientDto } from './../../../../interfaces/patient.interface';
import { AuthService } from './../../../../services/auth.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { PatientService } from '../../../../services/patient.service';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-patient-profile',
  imports: [LoadingSpinner,ReactiveFormsModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit {
  patientService = inject(PatientService);
  authService = inject(AuthService);

  patient = signal<PatientDto | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  profileForm = new FormGroup({
    dateOfBirth: new FormControl(''),
    gender: new FormControl(''),
    bloodType: new FormControl(''),
    emergencyContact: new FormControl('')
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.patientService.getMyProfile().subscribe({next: (res) => 
      {
        this.patient.set(res.data);
        this.profileForm.patchValue({
          dateOfBirth: res.data.dateOfBirth || '',
          gender: res.data.gender || '',
          bloodType: res.data.bloodType || '',
          emergencyContact: res.data.emergencyContact || ''
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
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
    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.patientService.updateProfile(this.profileForm.value as any).subscribe({
      next: (res) => {
        this.patient.set(res.data);
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Profile updated successfully!');
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
        this.errorMessage.set('Failed to update profile. Please try again.');
      }
    });
  }
}