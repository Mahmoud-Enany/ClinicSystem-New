export interface DoctorDto {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  title: string;
  bio: string;
  consultationFee: number;
  experienceYears: number;
  clinicAddress: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  specialtyName: string;
  specialtyId: number;
}

export interface CreateDoctorDto {
  specialtyId: number;
  title: string;
  bio: string;
  consultationFee: number;
  experienceYears: number;
  clinicAddress: string;
}

export interface UpdateDoctorDto {
  specialtyId: number;
  title: string;
  bio: string;
  consultationFee: number;
  experienceYears: number;
  clinicAddress: string;
  isAvailable: boolean;
}