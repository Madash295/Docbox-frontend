import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}/Profiles/getAllProfiles`);
  }
}
