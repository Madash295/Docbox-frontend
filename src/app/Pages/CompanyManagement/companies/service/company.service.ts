import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { baseURL } from '../../../../../app/environments/dev_baseURL';
import { Company } from '../model/company.model';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = baseURL.apiUrl;

  constructor(private http: HttpClient) {}


  CompanyStats(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/SuperAdmin/company-stats`);
  }  
removeCompany(companyId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/SuperAdmin/remove-company/${companyId}`);
}
  
  
  

}



