import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DoctorDto } from './../../../../interfaces/doctor.interface';
import { AppointmentService } from './../../../../services/appointment.service';
import { ScheduleService } from './../../../../services/schedule.service';
import { DoctorService } from './../../../../services/doctor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-book-appointment',
  imports: [LoadingSpinner,RouterLink,ReactiveFormsModule],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  doctorService = inject(DoctorService);
  scheduleService = inject(ScheduleService);
  appointmentService = inject(AppointmentService);

  doctor = signal<DoctorDto | null>(null);
  availableSlots = signal<string[]>([]);
  isLoading = signal(true);
  isLoadingSlots = signal(false);
  isBooking = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  selectedSlot = signal('');

  minDate = new Date().toISOString().split('T')[0];

  bookingForm = new FormGroup({
    appointmentDate: new FormControl('', [Validators.required]),
    notes: new FormControl('')
  });

  ngOnInit() {
    const doctorId = this.route.snapshot.params['doctorId'];
    this.loadDoctor(doctorId);
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

  onDateChange() {
    const date = this.bookingForm.value.appointmentDate;
    if (!date) return;

    this.selectedSlot.set('');
    this.availableSlots.set([]);
    this.isLoadingSlots.set(true);

    this.scheduleService.getAvailableSlots(this.doctor()!.id, date).subscribe({
      next: (res) => {
        this.availableSlots.set(res.data);
        this.isLoadingSlots.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoadingSlots.set(false);
      }
    });
  }

  selectSlot(slot: string) {
    this.selectedSlot.set(slot);
  }

  book() {
    if (!this.bookingForm.value.appointmentDate || !this.selectedSlot()) {
      this.errorMessage.set('Please select a date and time slot.');
      return;
    }

    this.isBooking.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const data = {
      doctorId: this.doctor()!.id,
      appointmentDate: this.bookingForm.value.appointmentDate!,
      timeSlot: this.selectedSlot(),
      notes: this.bookingForm.value.notes || ''
    };

    this.appointmentService.book(data).subscribe({
      next: (res) => {
        this.isBooking.set(false);
        this.successMessage.set('Appointment booked successfully!');
        setTimeout(() => {
          this.router.navigate(['/patient/appointments']);
        }, 2000);
      },
      error: (err) => {
        this.isBooking.set(false);
        this.errorMessage.set(err.error?.errors?.[0] || 'Failed to book appointment.');
      }
    });
  }
}
