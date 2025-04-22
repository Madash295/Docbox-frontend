import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Ensure HttpParams is imported
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
// import { User } from '../../../../models/user.model';
import { baseURL } from '../../environments/dev_baseURL';
// import { Profile } from '../profile.model';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = baseURL.apiUrl;

  constructor(private http: HttpClient) {}
  getListFiles(path: string): Observable<any> {
    const params = new HttpParams().set('path', path);
    return this.http.get(`${this.apiUrl}/File/list-files`, { params });
  }
  createFile(fileType: string, fileName: string, path: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/File/create-file`, {fileType,fileName,path});
  }
  openFile(path: string): Observable<any> {
    const params = new HttpParams().set('path', path);
    return this.http.get(`${this.apiUrl}/File/open-file`, { params });
  }

  getFileHistory(filePath: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.get(`${this.apiUrl}/File/history?filePath=${encodeURIComponent(filePath)}`, { headers });
  }




  getFileHistoryData(filePath: string, version: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.get(`${this.apiUrl}/File/history-data?filePath=${encodeURIComponent(filePath)}&version=${version}`, { headers });
  }

  restoreFileVersion(filePath: string, version: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.post(`${this.apiUrl}/File/restore-version`, { filePath, version }, { headers });
  }
}

