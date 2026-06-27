import { adminGuard } from './guards/admin.guard';
import { doctorGuard } from './guards/doctor.guard';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { patientGuard } from './guards/patient.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Public Pages
  {
    path: 'home',
    loadComponent: () => import('./components/pages/home/home').then(c => c.Home),
    title: 'Home | ClinicSystem'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/pages/about/about').then(c => c.About),
    title: 'About | ClinicSystem'
  },
  {
    path: 'doctors',
    loadComponent: () => import('./components/pages/doctors/doctors-list/doctors-list').then(c => c.DoctorsList),
    title: 'Doctors | ClinicSystem'
  },
  {
    path: 'doctors/:id',
    loadComponent: () => import('./components/pages/doctors/doctor-details/doctor-details').then(c => c.DoctorDetails),
    title: 'Doctor Profile | ClinicSystem'
  },

  // Auth Pages
  {
    path: 'login',
    loadComponent: () => import('./components/pages/auth/login/login').then(c => c.Login),
    title: 'Login | ClinicSystem'
  },
  {
    path: 'register',
    loadComponent: () => import('./components/pages/auth/register/register').then(c => c.Register),
    title: 'Register | ClinicSystem'
  },

  // Patient Pages
  {
    path: 'patient/profile',
    canActivate: [authGuard, patientGuard],
    loadComponent: () => import('./components/pages/patient/patient-profile/patient-profile').then(c => c.PatientProfile),
    title: 'My Profile | ClinicSystem'
  },
  {
    path: 'patient/appointments',
    canActivate: [authGuard, patientGuard],
    loadComponent: () => import('./components/pages/patient/patient-appointments/patient-appointments').then(c => c.PatientAppointments),
    title: 'My Appointments | ClinicSystem'
  },
  {
    path: 'patient/records',
    canActivate: [authGuard, patientGuard],
    loadComponent: () => import('./components/pages/patient/patient-medical-records/patient-medical-records').then(c => c.PatientMedicalRecords),
    title: 'My Records | ClinicSystem'
  },
  {
    path: 'book/:doctorId',
    canActivate: [authGuard, patientGuard],
    loadComponent: () => import('./components/pages/appointments/book-appointment/book-appointment').then(c => c.BookAppointment),
    title: 'Book Appointment | ClinicSystem'
  },

  // Doctor Pages
  {
    path: 'doctor/profile',
    canActivate: [authGuard, doctorGuard],
    loadComponent: () => import('./components/pages/doctor/doctor-profile/doctor-profile').then(c => c.DoctorProfile),
    title: 'My Profile | ClinicSystem'
  },
  {
    path: 'doctor/schedule',
    canActivate: [authGuard, doctorGuard],
    loadComponent: () => import('./components/pages/doctor/doctor-schedule/doctor-schedule').then(c => c.DoctorSchedule),
    title: 'My Schedule | ClinicSystem'
  },
  {
    path: 'doctor/appointments',
    canActivate: [authGuard, doctorGuard],
    loadComponent: () => import('./components/pages/doctor/doctor-appointments/doctor-appointments').then(c => c.DoctorAppointments),
    title: 'My Appointments | ClinicSystem'
  },

  // Admin Pages
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/pages/admin/dashboard/dashboard').then(c => c.Dashboard),
    title: 'Dashboard | ClinicSystem'
  },
  {
    path: 'admin/doctors',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/pages/admin/manage-doctors/manage-doctors').then(c => c.ManageDoctors),
    title: 'Manage Doctors | ClinicSystem'
  },
  {
    path: 'admin/patients',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/pages/admin/manage-patients/manage-patients').then(c => c.ManagePatients),
    title: 'Manage Patients | ClinicSystem'
  },
  {
    path: 'admin/specialties',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/pages/admin/manage-specialties/manage-specialties').then(c => c.ManageSpecialties),
    title: 'Manage Specialties | ClinicSystem'
  },

  // Not Found
  {
    path: '**',
    loadComponent: () => import('./components/pages/not-found/not-found').then(c => c.NotFound),
    title: '404 | ClinicSystem'
  }
];