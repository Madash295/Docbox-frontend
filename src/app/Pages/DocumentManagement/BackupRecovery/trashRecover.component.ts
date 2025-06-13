import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { TrashService } from './service/trash.service';
import { Trash } from './model/trash.model';
import { act } from '@ngrx/effects';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-trash-recover',
  standalone: true,
  imports: [CommonModule, DataTableModule, IconModule],
  templateUrl: './trashRecover.component.html',
  styleUrls: ['./trashRecover.component.css']
})
export class TrashComponent implements OnInit {
  @ViewChild('datatable') datatable: any;
  Backup: any = {};
  backupId: number = 0;
  chunkSize: number = 1000; // Number of records per chunk
  pageNumber: number = 1; // Initial page number
  backupsToDisplay: Trash[] = []; 
  allBackups: Trash[] = []; 

  constructor(private trashService:TrashService,private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.trashService.TrashFiles().subscribe({
      next: (response: any) => {
        const backup = Array.isArray(response) ? response : [response];
        this.rows = backup.map((user: any) => ({
            trashedFileId: user.trashedFileId,
            fileName: user.fileName,
            path: user.originalPath,
            fileExists: user.fileExists,
          deletedat: user.deletedAt
        }));
        this.allBackups = this.rows;
      },
      error: (error: any) => {
        console.error('Error fetching backups', error);
      }
    });
   
  }
   
  trashRecovery(path:string): void {
    this.trashService.trashRecovery(path).subscribe({
      next: (res: any) => {
        this.utilsService.showMessage('File recovered successfully!', 'success');
        this.ngOnInit();
      },
      error: (error: any) => {
        console.error('Error recovering Backup', error);
        this.utilsService.showMessage('Error recovering File.', 'error');
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
    { field: 'fileName', title: 'File Name' },
    { field: 'path', title: 'Path' },
    { field: 'fileExists', title: 'File Exists' },
    { field: 'deletedat', title: 'Deleted At DD-MM-YY' },
    { field: 'actions',title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  rows: any[] = [];
}
