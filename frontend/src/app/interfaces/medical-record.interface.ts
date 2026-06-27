export interface MedicalRecordDto {
  id: number;
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  recordDate: string;
}

export interface CreateMedicalRecordDto {
  appointmentId: number;
  diagnosis: string;
  prescription: string;
  notes: string;
}