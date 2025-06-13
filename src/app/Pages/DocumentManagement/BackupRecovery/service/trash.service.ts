import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { baseURL } from '../../../../../app/environments/dev_baseURL';
import { Trash } from '../model/trash.model';
@Injectable({
  providedIn: 'root'
})
export class TrashService {
  private apiUrl = baseURL.apiUrl;

  constructor(private http: HttpClient) {}


  TrashFiles(): Observable<Trash[]> {
    return this.http.get<Trash[]>(`${this.apiUrl}/File/trashed-files`);
  }  
trashRecovery(path: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/File/restore-file`, { path: path });
}
  
  
  

}



