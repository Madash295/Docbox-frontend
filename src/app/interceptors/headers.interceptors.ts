import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../service/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Interceptor to add a JWT token as a header to every request
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    debugger
    const jwtToken = this.authService.getToken();

    if (jwtToken) {
      // Check token expiration (handled in AuthService, in UTC)
      debugger
      const isTokenExpired = this.authService.isTokenExpired();

      if (!isTokenExpired) {
        // Token is not expired; add Authorization header
   
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${jwtToken}` // Add the JWT token to headers
          }
        });
        debugger
      } else {
        debugger
        // Token is expired; logout the user and redirect to login
         this.authService.logout(); // Log out the user
        // // Redirect to login page
        this.router.navigate(['/']);
        
        return throwError('Token expired');
      }
    }

    return next.handle(request).pipe(

      catchError((error: HttpErrorResponse) => {
        debugger
        
        // Handle 403 Forbidden error
        if (error.status === 401) {
          // this.authService.logout(); // Log out the user
          // this.router.navigate(['/']); // Redirect to login page
        }
        return throwError(error); // Rethrow the error so that it can be handled by other parts of the app
      })
    );
  }
}