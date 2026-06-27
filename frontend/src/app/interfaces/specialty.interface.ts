export interface SpecialtyDto {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  doctorsCount: number;
}

export interface CreateSpecialtyDto {
  name: string;
  description: string;
  iconUrl: string;
}