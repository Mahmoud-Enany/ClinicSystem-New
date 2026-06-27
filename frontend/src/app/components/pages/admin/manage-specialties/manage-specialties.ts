import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpecialtyDto } from './../../../../interfaces/specialty.interface';
import { Component, OnInit, inject, signal } from '@angular/core';
import { SpecialtyService } from '../../../../services/specialty.service';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-manage-specialties',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './manage-specialties.html',
  styleUrl: './manage-specialties.css',
})

export class ManageSpecialties implements OnInit {
  specialtyService = inject(SpecialtyService);

  specialties = signal<SpecialtyDto[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal<number | null>(null);
  showForm = signal(false);
  editingSpecialty = signal<SpecialtyDto | null>(null);
  successMessage = signal('');
  errorMessage = signal('');

  specialtyForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl(''),
    iconUrl: new FormControl('')
  });

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.specialtyService.getAll().subscribe({
      next: (res) => {
        this.specialties.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    this.editingSpecialty.set(null);
    this.specialtyForm.reset();
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  editSpecialty(specialty: SpecialtyDto) {
    this.editingSpecialty.set(specialty);
    this.showForm.set(true);
    this.specialtyForm.patchValue({
      name: specialty.name,
      description: specialty.description,
      iconUrl: specialty.iconUrl
    });
  }

  saveSpecialty() {
    if (this.specialtyForm.invalid) {
      this.specialtyForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const data = this.specialtyForm.value as any;

    if (this.editingSpecialty()) {
      this.specialtyService.update(this.editingSpecialty()!.id, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showForm.set(false);
          this.editingSpecialty.set(null);
          this.successMessage.set('Specialty updated successfully!');
          this.loadSpecialties();
        },
        error: () => {
          this.isSaving.set(false);
          this.errorMessage.set('Failed to update specialty.');
        }
      });
    } else {
      this.specialtyService.create(data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showForm.set(false);
          this.successMessage.set('Specialty created successfully!');
          this.loadSpecialties();
        },
        error: () => {
          this.isSaving.set(false);
          this.errorMessage.set('Failed to create specialty.');
        }
      });
    }
  }

  deleteSpecialty(id: number) {
    this.isDeleting.set(id);
    this.specialtyService.delete(id).subscribe({
      next: () => {
        this.isDeleting.set(null);
        this.successMessage.set('Specialty deleted successfully!');
        this.loadSpecialties();
      },
      error: (err) => {
        this.isDeleting.set(null);
        this.errorMessage.set(err.error?.errors?.[0] || 'Cannot delete specialty with doctors.');
      }
    });
  }
}