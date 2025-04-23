import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { DeleteModalComponent } from '../common/delete-modal/delete-modal.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { ProfileService } from './service/profile.service';
import { Profile } from './profile.model';
import { act } from '@ngrx/effects';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DataTableModule, ProfileModalComponent, IconModule, DeleteModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // Corrected styleUrl to styleUrls
})
export class ProfileComponent implements OnInit {
  @ViewChild('datatable') datatable: any;
  isProfileModalOpen = false;
  isDeleteProfileModalOpen = false;
  profile: any = {};
  serviceName = 'Profile';
  deleteserviceName = 'Delete Profile';
  profileId: number = 0;
  chunkSize: number = 1000; // Number of records per chunk
  pageNumber: number = 1; // Initial page number
  profilesToDisplay: Profile[] = []; 
  allProfiles: Profile[] = []; 

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.listUsers().subscribe({
      next: (response: any) => {
        console.log('List users API response:', response);
        // If API returns a single object, wrap it into an array.
        const users = Array.isArray(response) ? response : [response];
        this.rows = users.map((user: any) => ({
          UserName: user.username,
          Email: user.email,
          CompanyName: user.companyName,
          Joinedat: user.createdAt
        }));
        // For potential pagination using loadNextChunk.
        this.allProfiles = this.rows;
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
   
  }

 

  loadNextChunk(): void {
    const start = (this.pageNumber - 1) * this.chunkSize;
    const end = start + this.chunkSize;

    this.profilesToDisplay = [...this.profilesToDisplay, ...this.allProfiles.slice(start, end)];
    this.pageNumber++;

    // Check if more profiles are available to load
    if (this.profilesToDisplay.length < this.allProfiles.length) {
      setTimeout(() => this.loadNextChunk(), 5);
    }
  }

  openProfileModal(profileData: any = null) {
    this.profile = profileData;
    this.isProfileModalOpen = true;
  }

  openDeleteProfileModal(profileId: number) {
    this.profileId = profileId;
    this.isDeleteProfileModalOpen = true;
  }

  onPageChange(event: any) {
    this.pageNumber = event;
    console.log(`Page Number: ${this.pageNumber}, Page Size: ${this.chunkSize}`);
  }

  onPageSizeChange(event: any) {
    this.chunkSize = event;
    console.log(`Page Number: ${this.pageNumber}, Page Size: ${this.chunkSize}`);
  }

  logFilters() {
    // Retrieve all column filters using getColumnFilters and log them
    const filters = this.datatable.getColumnFilters();
    // Filter and map the necessary filters
    const activeFilters = filters
      .filter((filter: any) => filter.value !== undefined && filter.value !== null) // Only filters with a value
      .map((filter: any) => ({
        field: filter.field,
        condition: filter.condition,
        value: filter.value
      }));

    // Log the array of active filters
    console.log('Active Filters:', activeFilters);
    console.log(`Current Page Size: ${this.chunkSize}, Current Page Number: ${this.pageNumber}`);
  }

  search = '';
  cols = [
    // { field: 'id', title: 'ID', isUnique: true, filter: false },
    { field: 'UserName', title: 'Full Name' },
    { field: 'Email', title: 'Email' },
    { field: 'CompanyName', title: 'Company Name' },
    { field: 'Joinedat', title: 'Joined At DD-MM-YY' },
    { field: 'actions',title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  rows: any[] = [];
}
