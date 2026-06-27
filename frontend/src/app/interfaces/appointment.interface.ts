export interface AppointmentDto {
  id: number;
  doctorName: string;
  patientName: string;
  specialtyName: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  cancellationReason: string;
  consultationFee: number;
  createdAt: string;
}

export interface BookAppointmentDto {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  notes: string;
}

export interface UpdateAppointmentDto {
  status: string;
  cancellationReason: string;
}