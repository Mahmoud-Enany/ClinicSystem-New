import { MedicalRecordDto } from './../../../../interfaces/medical-record.interface';
import { MedicalRecordService } from './../../../../services/medical-record.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-patient-medical-records',
  imports: [LoadingSpinner],
  templateUrl: './patient-medical-records.html',
  styleUrl: './patient-medical-records.css',
})
export class PatientMedicalRecords implements OnInit {
  medicalRecordService = inject(MedicalRecordService);

  records = signal<MedicalRecordDto[]>([]);
  isLoading = signal(true);
  expandedRecord = signal<number | null>(null);

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.medicalRecordService.getMyRecords().subscribe({
      next: (res) => {
        this.records.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleRecord(id: number) 
  {
    if (this.expandedRecord() === id) {
      this.expandedRecord.set(null);
    } else {
      this.expandedRecord.set(id);
    }
  }
}

