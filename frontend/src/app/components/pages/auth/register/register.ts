import { Router, RouterLink } from '@angular/router';
import { AuthService } from './../../../../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  currentStep = signal(1);

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(11)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('Patient', [Validators.required])
  });

  get firstName() { return this.registerForm.controls['firstName']; }
  get lastName() { return this.registerForm.controls['lastName']; }
  get email() { return this.registerForm.controls['email']; }
  get phoneNumber() { return this.registerForm.controls['phoneNumber']; }
  get password() { return this.registerForm.controls['password']; }
  get role() { return this.registerForm.controls['role']; }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  selectRole(role: string) {
    this.registerForm.controls['role'].setValue(role);
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.value as any).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const role = res.data.role;
        if (role === 'Doctor') this.router.navigate(['/doctor/profile']);
        else this.router.navigate(['/patient/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.errors?.[0] || 'Registration failed. Please try again.');
      }
    });
  }
}
