export interface ScheduleDto {
  id: number;
  doctorId: number;
  dayName: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
}

export interface CreateScheduleDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}