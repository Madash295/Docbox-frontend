import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

export const roleResolver: ResolveFn<string | null> = (route, state) => {
  // Fetch user roles from localStorage
  const userRole = localStorage.getItem('userRole');
  return of(userRole); // Return the role wrapped in an Observable
};
