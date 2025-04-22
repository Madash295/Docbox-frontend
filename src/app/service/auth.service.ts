import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = localStorage.getItem('token');

  // Decode the JWT token to extract the payload and get expiration (exp) in milliseconds
  private  getTokenExpiration(): number | null {
    var accessToken =  this.getToken()
    if (!accessToken) {
      debugger
      return null;
    }

    try {
      debugger
      const payload = JSON.parse(atob(accessToken.split('.')[1])); // Decode base64 payload
      debugger
      if (payload.exp) {
        debugger
        return payload.exp * 1000; // Convert seconds to milliseconds
      }
    } catch (error) {
      debugger
      console.error('Error parsing JWT token:', error);
    }

    return null;
  }

  // Check if the token is expired
  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    debugger

    if (expiration) {
      debugger
      // Use current UTC time to check expiration
      const currentUtcTime = new Date().getTime(); // Get current time in UTC (milliseconds)

      return expiration <= currentUtcTime; // If current UTC time > expiry, the token is expired
    }

    return true; // If no expiration found or error occurred, consider the token expired
  }

  // Set token and save it to local storage
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('Token', token); // Save token to local storage
  }

  // Get the token from local storage
  getToken(): string | null {
    debugger
    return localStorage.getItem('token'); // Retrieve the token from local storage
  }

  // Logout the user (remove token from local storage and clear the token)
  logout() {
    console.log('logout called');
    localStorage.removeItem('token'); 
    localStorage.removeItem('IsLoggedIn');
    localStorage.removeItem('User'); 
  }
}