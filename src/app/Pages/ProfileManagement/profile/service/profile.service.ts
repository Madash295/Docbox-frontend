import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { baseURL } from '../../../../../app/environments/dev_baseURL';
import { Profile } from '../profile.model';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = baseURL.apiUrl;

  constructor(private http: HttpClient) {}


  listUsers(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/File/list-users`);
  }


  adduser(Email: string): Observable<any> {

     const body = {
      email: Email
    };
    return this.http.post(`${this.apiUrl}/Admin/add-user`, body);
  }


  removeUser(userId: string): Observable<any> {
    const userIdInt = parseInt(userId);
    // Send userId as a query parameter
    const params = new HttpParams().set('userId', userIdInt.toString());
    return this.http.delete(`${this.apiUrl}/Admin/remove-user`, { params });
  } 
  
  
  

}



