export interface PatientDto {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  emergencyContact: string;
}

export interface UpdatePatientDto {
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  emergencyContact: string;
}