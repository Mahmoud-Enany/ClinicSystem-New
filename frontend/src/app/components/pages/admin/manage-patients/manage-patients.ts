import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PatientDto } from './../../../../interfaces/patient.interface';
import { PatientService } from './../../../../services/patient.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-manage-patients',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './manage-patients.html',
  styleUrl: './manage-patients.css',
})
export class ManagePatients implements OnInit {
  patientService = inject(PatientService);

  patients = signal<PatientDto[]>([]);
  filteredPatients = signal<PatientDto[]>([]);
  isLoading = signal(true);

  searchControl = new FormControl('');

  ngOnInit() {
    this.loadPatients();
    this.searchControl.valueChanges.subscribe(() => this.filterPatients());
  }

  loadPatients() {
    this.patientService.getAll().subscribe({
      next: (res) => {
        this.patients.set(res.data);
        this.filteredPatients.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  filterPatients() {
    const search = this.searchControl.value?.toLowerCase() || '';
    if (!search) {
      this.filteredPatients.set(this.patients());
      return;
    }
    this.filteredPatients.set(
      this.patients().filter(p =>
        p.fullName.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        (p.bloodType?.toLowerCase().includes(search) ?? false)
      )
    );
  }
}
