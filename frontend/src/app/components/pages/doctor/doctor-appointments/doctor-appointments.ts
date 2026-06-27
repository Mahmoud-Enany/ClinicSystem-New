import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentDto } from './../../../../interfaces/appointment.interface';
import { MedicalRecordService } from './../../../../services/medical-record.service';
import { AppointmentService } from './../../../../services/appointment.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-doctor-appointments',
  imports: [LoadingSpinner,RouterLink,ReactiveFormsModule,SlicePipe],
  templateUrl: './doctor-appointments.html',
  styleUrl: './doctor-appointments.css',
})
export class DoctorAppointments implements OnInit {
  appointmentService = inject(AppointmentService);
  medicalRecordService = inject(MedicalRecordService);

  appointments = signal<AppointmentDto[]>([]);
  filteredAppointments = signal<AppointmentDto[]>([]);
  isLoading = signal(true);
  selectedTab = signal('all');
  updatingId = signal<number | null>(null);
  showRecordModal = signal(false);
  selectedAppointmentId = signal<number | null>(null);
  isSavingRecord = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  recordForm = new FormGroup({
    diagnosis: new FormControl('', [Validators.required]),
    prescription: new FormControl(''),
    notes: new FormControl('')
  });

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getMyAppointments().subscribe({
      next: (res) => {
        this.appointments.set(res.data);
        this.filterByTab('all');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  filterByTab(tab: string) {
    this.selectedTab.set(tab);
    if (tab === 'all') {
      this.filteredAppointments.set(this.appointments());
    } else {
      this.filteredAppointments.set(
        this.appointments().filter(a => a.status.toLowerCase() === tab)
      );
    }
  }

  updateStatus(id: number, status: string) {
    this.updatingId.set(id);
    this.appointmentService.updateStatus(id, { status, cancellationReason: '' }).subscribe({
      next: () => {
        this.updatingId.set(null);
        this.successMessage.set(`Appointment ${status.toLowerCase()} successfully!`);
        this.loadAppointments();
      },
      error: (err) => {
        this.updatingId.set(null);
        this.errorMessage.set('Failed to update status.');
      }
    });
  }

  openRecordModal(appointmentId: number) {
    this.selectedAppointmentId.set(appointmentId);
    this.showRecordModal.set(true);
    this.recordForm.reset();
  }

  closeRecordModal() {
    this.showRecordModal.set(false);
    this.selectedAppointmentId.set(null);
  }

  saveRecord() {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    this.isSavingRecord.set(true);

    const data = {
      appointmentId: this.selectedAppointmentId()!,
      diagnosis: this.recordForm.value.diagnosis!,
      prescription: this.recordForm.value.prescription || '',
      notes: this.recordForm.value.notes || ''
    };

    this.medicalRecordService.create(data).subscribe({
      next: () => {
        this.isSavingRecord.set(false);
        this.closeRecordModal();
        this.successMessage.set('Medical record added successfully!');
        this.loadAppointments();
      },
      error: (err) => {
        this.isSavingRecord.set(false);
        this.errorMessage.set(err.error?.errors?.[0] || 'Failed to add medical record.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getTabCount(tab: string): number {
    if (tab === 'all') return this.appointments().length;
    return this.appointments().filter(a => a.status.toLowerCase() === tab).length;
  }
}
