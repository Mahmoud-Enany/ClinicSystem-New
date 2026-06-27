import { LoadingSpinner } from './../../../shared/loading-spinner/loading-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScheduleDto } from './../../../../interfaces/schedule.interface';
import { ScheduleService } from './../../../../services/schedule.service';
import { Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-doctor-schedule',
  imports: [ReactiveFormsModule,LoadingSpinner],
  templateUrl: './doctor-schedule.html',
  styleUrl: './doctor-schedule.css',
})
export class DoctorSchedule implements OnInit {
  scheduleService = inject(ScheduleService);

  schedules = signal<ScheduleDto[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal<number | null>(null);
  showForm = signal(false);
  editingSchedule = signal<ScheduleDto | null>(null);
  successMessage = signal('');
  errorMessage = signal('');

  days = [
    { value: 0, name: 'Sunday' },
    { value: 1, name: 'Monday' },
    { value: 2, name: 'Tuesday' },
    { value: 3, name: 'Wednesday' },
    { value: 4, name: 'Thursday' },
    { value: 5, name: 'Friday' },
    { value: 6, name: 'Saturday' }
  ];

  scheduleForm = new FormGroup({
    dayOfWeek: new FormControl(0, [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    slotDurationMinutes: new FormControl(30, [Validators.required, Validators.min(15)])
  });

  ngOnInit() {
    this.loadSchedules();
  }

  loadSchedules() {
    this.scheduleService.getMySchedules().subscribe({
      next: (res) => {
        this.schedules.set(res.data);
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
    this.editingSchedule.set(null);
    this.scheduleForm.reset({ dayOfWeek: 0, slotDurationMinutes: 30 });
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  editSchedule(schedule: ScheduleDto) {
    this.editingSchedule.set(schedule);
    this.showForm.set(true);
    this.scheduleForm.patchValue({
      dayOfWeek: schedule.id,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMinutes: schedule.slotDurationMinutes
    });
  }

  saveSchedule() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const data = this.scheduleForm.value as any;

    if (this.editingSchedule()) {
      this.scheduleService.update(this.editingSchedule()!.id, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showForm.set(false);
          this.editingSchedule.set(null);
          this.successMessage.set('Schedule updated successfully!');
          this.loadSchedules();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set('Failed to update schedule.');
        }
      });
    } else {
      this.scheduleService.create(data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showForm.set(false);
          this.successMessage.set('Schedule created successfully!');
          this.loadSchedules();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.errors?.[0] || 'Failed to create schedule.');
        }
      });
    }
  }

  deleteSchedule(id: number) {
    this.isDeleting.set(id);
    this.scheduleService.delete(id).subscribe({
      next: () => {
        this.isDeleting.set(null);
        this.successMessage.set('Schedule deleted successfully!');
        this.loadSchedules();
      },
      error: (err) => {
        this.isDeleting.set(null);
        this.errorMessage.set('Failed to delete schedule.');
      }
    });
  }

  getUsedDays(): number[] {
    return this.schedules().map(s => {
      const day = this.days.find(d => d.name === s.dayName);
      return day ? day.value : -1;
    });
  }

  isDayUsed(dayValue: number): boolean {
    if (this.editingSchedule()) return false;
    return this.getUsedDays().includes(dayValue);
  }
  calculateSlots(schedule: ScheduleDto): number {
  const [startH, startM] = schedule.startTime.split(':').map(Number);
  const [endH, endM] = schedule.endTime.split(':').map(Number);
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  return Math.floor(totalMinutes / schedule.slotDurationMinutes);
}
}

