import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { DeleteModalComponent } from '../../ProfileManagement/common/delete-modal/delete-modal.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { CompanyService } from './service/company.service';
import { Company } from './model/company.model';
import { act } from '@ngrx/effects';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, DataTableModule, IconModule, DeleteModalComponent],
  templateUrl: './company-stat.component.html',
  styleUrls: ['./company-stat.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild('datatable') datatable: any;
  isCompanyModalOpen = false;
  isDeleteCompanyModalOpen = false;
  Company: any = {};
  serviceName = 'Company';
  deleteserviceName = 'Delete Company';
  companyId: number = 0;
  chunkSize: number = 1000; // Number of records per chunk
  pageNumber: number = 1; // Initial page number
  companysToDisplay: Company[] = []; 
  allCompanys: Company[] = []; 

  constructor(private companyService: CompanyService,private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.companyService.CompanyStats().subscribe({
      next: (response: any) => {
        // If API returns a single object, wrap it into an array.
        const company = Array.isArray(response) ? response : [response];
        this.rows = company.map((user: any) => ({
          id: user.companyId, 
          UserCount: user.userCount,
          StorageUsedMbs: user.storageUsedMB,
          CompanyName: user.companyName,
          Joinedat: user.createdAt
        }));
        this.allCompanys = this.rows;
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
   
  }
   
  deleteCompany(): void {
    this.companyService.removeCompany(this.companyId.toString()).subscribe({
      next: (res: any) => {
        this.utilsService.showMessage('Company deleted successfully!', 'success');
        this.ngOnInit();
      },
      error: (error: any) => {
        console.error('Error deleting company', error);
        this.utilsService.showMessage('Error deleting company.', 'error');
      }
    });
  }
 

  loadNextChunk(): void {
    const start = (this.pageNumber - 1) * this.chunkSize;
    const end = start + this.chunkSize;

    this.companysToDisplay = [...this.companysToDisplay, ...this.allCompanys.slice(start, end)];
    this.pageNumber++;

    // Check if more companys are available to load
    if (this.companysToDisplay.length < this.allCompanys.length) {
      setTimeout(() => this.loadNextChunk(), 5);
    }
  }

  openCompanyModal(companyData: any = null) {
    this.Company = companyData;
    this.isCompanyModalOpen = true;
  }

  openDeleteCompanyModal(companyId: number) {
    this.companyId = companyId;
    this.isDeleteCompanyModalOpen = true;
  }

  onPageChange(event: any) {
  }

  onPageSizeChange(event: any) {
    this.chunkSize = event;
  }
  
  search = '';
  cols = [
    { field: 'CompanyName', title: 'Company Name' },
    { field: 'UserCount', title: 'User Count' },
    { field: 'StorageUsedMbs', title: 'Storage Used MBs' },
    { field: 'Joinedat', title: 'Joined At DD-MM-YY' },
    { field: 'actions',title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  rows: any[] = [];
}
