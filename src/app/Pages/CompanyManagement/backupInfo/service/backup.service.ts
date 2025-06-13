import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { baseURL } from '../../../../../app/environments/dev_baseURL';
import { Backup } from '../model/backup.modal';
@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiUrl = baseURL.apiUrl;

  constructor(private http: HttpClient) {}


  BackupInfo(): Observable<Backup[]> {
    return this.http.get<Backup[]>(`${this.apiUrl}/SuperAdmin/backup-info`);
  }  
restoreBackup(name: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/SuperAdmin/restore-backup`,
    JSON.stringify(name), 
    { headers: { 'Content-Type': 'application/json' } }
  );
}
  
  
  

}



