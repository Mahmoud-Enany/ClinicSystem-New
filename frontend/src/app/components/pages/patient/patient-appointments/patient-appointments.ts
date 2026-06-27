import { LoadingSpinner } from './../../../shared/loading-spinner/loading-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentDto } from './../../../../interfaces/appointment.interface';
import { AppointmentService } from './../../../../services/appointment.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-patient-appointments',
  imports: [RouterLink, LoadingSpinner, ReactiveFormsModule,SlicePipe],
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css',
})
export class PatientAppointments  implements OnInit {
  appointmentService = inject(AppointmentService);

  appointments = signal<AppointmentDto[]>([]);
  filteredAppointments = signal<AppointmentDto[]>([]);
  isLoading = signal(true);
  selectedTab = signal('all');
  cancellingId = signal<number | null>(null);
  showCancelModal = signal(false);
  selectedAppointmentId = signal<number | null>(null);

  cancelForm = new FormGroup({
    reason: new FormControl('', [Validators.required, Validators.minLength(5)])
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

  openCancelModal(id: number) {
    this.selectedAppointmentId.set(id);
    this.showCancelModal.set(true);
    this.cancelForm.reset();
  }

  closeCancelModal() {
    this.showCancelModal.set(false);
    this.selectedAppointmentId.set(null);
  }

  confirmCancel() 
  {
    if (this.cancelForm.invalid) {
      this.cancelForm.markAllAsTouched();
      return;
    }

    const id = this.selectedAppointmentId()!;
    const reason = this.cancelForm.value.reason!;

    this.cancellingId.set(id);

    this.appointmentService.cancel(id, reason).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.closeCancelModal();
        this.loadAppointments();
      },
      error: (err) => {
        console.error(err);
        this.cancellingId.set(null);
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

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'completed': return 'fas fa-check-double';
      case 'cancelled': return 'fas fa-times-circle';
      default: return 'fas fa-circle';
    }
  }

  getTabCount(tab: string): number {
    if (tab === 'all') return this.appointments().length;
    return this.appointments().filter(a => a.status.toLowerCase() === tab).length;
  }
}
