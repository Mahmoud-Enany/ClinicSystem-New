import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const doctorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role === 'Doctor') return true;

  return router.navigate(['/login']);
};