import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { BackupService } from './service/backup.service';
import { Backup } from './model/backup.modal';
import { act } from '@ngrx/effects';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, DataTableModule, IconModule],
  templateUrl: './backup-info.component.html',
  styleUrls: ['./backup-info.component.css']
})
export class BackupComponent implements OnInit {
  @ViewChild('datatable') datatable: any;
  Backup: any = {};
  backupId: number = 0;
  chunkSize: number = 1000; // Number of records per chunk
  pageNumber: number = 1; // Initial page number
  backupsToDisplay: Backup[] = []; 
  allBackups: Backup[] = []; 

  constructor(private backupService:BackupService,private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.backupService.BackupInfo().subscribe({
      next: (response: any) => {
        const backup = Array.isArray(response) ? response : [response];
        this.rows = backup.map((user: any) => ({
          HasDatabase: user.hasDatabase,
          HasFiles: user.hasFiles,
          HasConfig: user.hasConfig,
          sizeMB:user.sizeMB,
          backupName: user.name,
          Joinedat: user.createdAt
        }));
        this.allBackups = this.rows;
      },
      error: (error: any) => {
        console.error('Error fetching backups', error);
      }
    });
   
  }
   
  recoverBackup(name:string): void {
    this.backupService.restoreBackup(name).subscribe({
      next: (res: any) => {
        this.utilsService.showMessage('Backup recovered successfully!', 'success');
        this.ngOnInit();
      },
      error: (error: any) => {
        console.error('Error recovering Backup', error);
        this.utilsService.showMessage('Error recovering Backup.', 'error');
      }
    });
  }
 

  loadNextChunk(): void {
    const start = (this.pageNumber - 1) * this.chunkSize;
    const end = start + this.chunkSize;

    this.backupsToDisplay = [...this.backupsToDisplay, ...this.allBackups.slice(start, end)];
    this.pageNumber++;

    // Check if more Backups are available to load
    if (this.backupsToDisplay.length < this.allBackups.length) {
      setTimeout(() => this.loadNextChunk(), 5);
    }
  }

 
  onPageChange(event: any) {
  }

  onPageSizeChange(event: any) {
    this.chunkSize = event;
  }
  
  search = '';
  cols = [
    { field: 'backupName', title: 'Backup Name' },
    { field: 'sizeMB', title: 'Size MB' },
    { field: 'HasDatabase', title: 'Has Database' },
    { field: 'HasFiles', title: 'Has Files' },
    { field: 'HasConfig', title: 'Has Config' },
    { field: 'Joinedat', title: 'Joined At DD-MM-YY' },
    { field: 'actions',title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  rows: any[] = [];
}
