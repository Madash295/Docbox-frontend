import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Retrieve the user's role from localStorage or a service
  const userRole = localStorage.getItem('userRole');
  console.log(userRole)
  const requiredRoles = route.data ? route.data['roles'] : null;
  console.log(requiredRoles)
  debugger

  if (requiredRoles && requiredRoles.includes(userRole || '')) {
    return true; // Allow access
  
  }

  // Redirect to an unauthorized or login page
 ///router.navigate(['/']);
  return true;
};
