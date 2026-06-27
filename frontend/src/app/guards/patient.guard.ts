import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const patientGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role === 'Patient') return true;

  return router.navigate(['/login']);
};