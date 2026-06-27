import { Router, RouterLink } from '@angular/router';
import { AuthService } from './../../../../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get email() { return this.loginForm.controls['email']; }
  get password() { return this.loginForm.controls['password']; }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value as any).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const role = res.data.role;
        if (role === 'Admin') this.router.navigate(['/admin/dashboard']);
        else if (role === 'Doctor') this.router.navigate(['/doctor/profile']);
        else this.router.navigate(['/patient/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password. Please try again.');
      }
    });
  }
}
