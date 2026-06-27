import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar 
{
   authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
}
}
