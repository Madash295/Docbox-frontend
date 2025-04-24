import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DocumentService } from '../document.service'; // Ensure the service path is correct

import { NgSelectModule } from '@ng-select/ng-select';
import { DocumentEditorModule, type IConfig } from '@onlyoffice/document-editor-angular';
import { UtilsService } from 'src/app/utils.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, DataTableModule, IconModule, FormsModule, DocumentEditorModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  @ViewChild('datatable') datatable: any;
  isModalOpen = false;
  search = '';
  @Output() shareCompleted: EventEmitter<any> = new EventEmitter();
  cols = [
    { field: 'name', title: 'Name' },
    { field: 'type', title: 'Type' },
    { field: 'size', title: 'Size' },
    { field: 'mark', title: 'Important'},
    { field: 'modified', title: 'Last Modified' },
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  items: any[] = [];
  createFileForm!: FormGroup;
  createFolderForm!: FormGroup;

  isArchiveModalOpen: boolean = false;
  archiveForm!: FormGroup;
  archiveSelectedFiles: any[] = [];

  isSummaryPanelOpen = false;
  isLoadingSummary = false;
  documentSummary: string | null = null;



isShareModalOpen: boolean = false;
  accessTypes = [
    { id: '6', name: 'ViewOnly' },
    { id: '7', name: 'Strict View' },
    { id: '8', name: 'Editor' },
    { id: '9', name: 'Viewonce' },
    { id: '10', name: 'EditView TimeShared' },
    { id: '11', name: 'StrictView TimeShared' },
  ];
  filePaths: string[] = [];
  currentStep: number = 1;
  shareFormStep1!: FormGroup;
  shareFormStep2!: FormGroup;
  users: any[] = [];







  isFileModalOpen: boolean = false;
  isFolderModalOpen: boolean = false;
  folderStack: string[] = []; // Stack to manage folder navigation
  currentPath: string = ''; // Stores the current path as breadcrumb
  pathHistory: any[] = []; // Store JSON structure for folder paths
  selectedFileConfig: IConfig | null = null;
  fileTypes = [
    { value: 'document', label: 'Document (.docx)' },
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'ppt', label: 'PowerPoint (.pptx)' }
  ];

  constructor(private documentService: DocumentService, private fb: FormBuilder,private utilsService: UtilsService,) {
   

  }


  ngOnInit(): void {
    this.loadFiles('.');
    this.createFileForm = this.fb.group({
      fileType: ['', Validators.required],
      fileName: ['', Validators.required],
    });
    this.createFolderForm = this.fb.group({
      folderName: ['', Validators.required],
    });

    this.archiveForm = this.fb.group({
      archiveName: ['', Validators.required],
    });

    this.shareFormStep1 = this.fb.group({
      selectedUsers: [[], Validators.required]
    });
    this.shareFormStep2 = this.fb.group({
      accessType: ['', Validators.required],
      expiration: [''] 
      



    });


    this.documentService.listUsers().subscribe({
      next: (response) => {
        // Adjust the property path based on your API response.
        this.users = response.users || response;
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });


  }

  loadFiles(path: string): void {
    this.documentService.getListFiles(path).subscribe(
      (response: any) => {
        this.items = response.contents.map((item: any) => ({
          ...item,
          icon: this.getIcon(item),
        }));
        this.updateBreadcrumb(path);
      },
      (error) => {
        console.error('Error loading files:', error);
      }
    );
  }

  getIcon(item: any): string {
    if (item.type === 'Folder') {
      return '/assets/images/folder.png'; // Replace with actual folder icon path
    }
    if (item.type === 'File') {
      if (item.name.endsWith('.docx')) {
        return '/assets/images/doc.png'; // Replace with actual doc icon path
      }
      if (item.name.endsWith('.xlsx')) {
        return '/assets/images/xls.png'; // Replace with actual xls icon path
      }
      if (item.name.endsWith('.pptx')) {
        return '/assets/images/ppt.png'; // Replace with actual xls icon path
      }

      if (item.name.endsWith('.pdf')) {
        return '/assets/images/pdf.png'; // Replace with actual pdf icon path
      }
     
      if (item.name.endsWith('.zip')) {
        return '/assets/images/zip.png'; // Replace with actual zip icon path
      }

    }
    return '/assets/icons/file-icon.png'; // Default file icon
  }

  handleRowClick(row: any): void {
    if (row.type === 'Folder') {
      this.folderStack.push(row.name);
      const newPath = this.folderStack.join('/');
      this.pathHistory.push({
        key: 'path',
        value: newPath,
        equals: true,
        description: '',
        enabled: true,
        uuid: this.generateUUID(),
      });

      console.log('Path History:', this.pathHistory); // Logs the updated path history
      this.loadFiles(newPath);
    } else if (row.type === 'File') {
      console.log('File clicked:', row.name);
      this.openFileInEditor(row);
    }
  }

  goBack(): void {
    if (this.folderStack.length > 0) {
      this.folderStack.pop();
      const parentFolder = this.folderStack[this.folderStack.length - 1] || '.';
      this.loadFiles(parentFolder);
    }
  }

  updateBreadcrumb(path: string): void {
    if (path === '.') {
      this.currentPath = '';
      this.folderStack = [];
      this.pathHistory = [];
    } else {
      this.currentPath = this.folderStack.join('/');
    }
  }


  generateUUID(): string {
    // Generate a random UUID (v4)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  // openFileInEditor(file: any): void {
  //   if (!file || file.type !== 'File') return;
  //   this.documentService.openFile(file.path).subscribe(
  //     (response) => {
  //       console.log(response);
  //       const documentData = JSON.parse(decodeURIComponent(encodeURIComponent(JSON.stringify(response.documentData))));
  //       documentData.token = encodeURIComponent(response.token);
  //       console.log(documentData)
  //       this.selectedFileConfig = documentData;
  //     },
  //     (error) => {
  //       console.error('Error opening file:', error);
  //       alert('Unable to open the file. Please try again later.');
  //     }
  //   );
  // }

  // getEditorConfig(fileUrl: string, fileName: string, fileType: string): IConfig {
  //   return {
  //     document: {
  //       fileType: fileType === 'xlsx' ? 'xlsx' : 'docx',
  //       key: this.generateUUID(),
  //       title: fileName,
  //       url: fileUrl,
  //     },
  //     documentType: fileType === 'xlsx' ? 'cell' : 'word',
  //     editorConfig: {
  //       callbackUrl: `http://localhost:5235/api/File/track`,
  //       user: {
  //         id: '1',
  //         name: 'User Name',
  //       },
  //     },
  //   };
  // }

  relativeFilePath: string = '';
  openFileInEditor(file: any): void {
    if (!file || file.type !== 'File') return;
    
    this.documentService.openFile(file.path).subscribe({
      next: (response) => {
        // const documentData = response.documentData;
        // documentData.token = response.token;
        const documentData = JSON.parse(decodeURIComponent(encodeURIComponent(JSON.stringify(response.documentData))));
        documentData.token = encodeURIComponent(response.token);
        this.relativeFilePath = documentData.document.filePath;
        console.log(documentData)
        // this.selectedFileConfig = documentData;
        
        // Add history event handlers
        documentData.events = {
          onRequestHistory: (event: any) => this.onRequestHistory(event),
          onRequestHistoryData: (event: any) => this.onRequestHistoryData(event),
          onRequestRestore: (event: any) => this.onRequestRestore(event),
          onRequestHistoryClose: () => this.onRequestHistoryClose()
        };

        this.selectedFileConfig = documentData;
      },
      error: (error) => {
        console.error('Error opening file:', error);
        alert('Unable to open the file. Please try again later.');
      }
    });
  }

  onRequestHistory(event: any): void {
    this.documentService.getFileHistory(this.relativeFilePath).subscribe({
      next: (historyData) => {
        const formattedHistory = {
          currentVersion: historyData.currentVersion,
          history: historyData.history.map((version: any) => ({
            created: version.created,
            key: version.key,
            user: {
              id: version.user.id,
              name: version.user.name,
            },
            version: version.version || historyData.currentVersion,
            changesUrl: version.changesUrl || null,
          })),
        };
        const editorInstance = this.docEditor || (window as any).DocEditor?.instances?.["docxEditor"];
        if (editorInstance) {
          editorInstance.refreshHistory(formattedHistory);
        } else {
          console.error("Document refresh is not initialized.");
        }
       
        
        // if (this.docEditor) {
        //   console.log('Refreshing history in DocEditor:', formattedHistory);
        //   this.docEditor.refreshHistory(formattedHistory);
          
        //   } else {
          
        //   console.error('DocEditor instance not available');
          
        //   }
      
      },
      error: (error) => {
        console.error("Error fetching or processing history:", error);
      }
    });
  }

  onRequestHistoryData(event: any): void {
    this.documentService.getFileHistoryData(this.relativeFilePath, event.data).subscribe({

      next: (versionData) => {
        const historyData = {
          changesUrl: versionData.changesUrl,
          fileType: this.selectedFileConfig && this.selectedFileConfig.document ? this.selectedFileConfig.document.fileType : '',
          key: versionData.key,
          previous: versionData.previousKey ? {
            fileType: this.selectedFileConfig?.document?.fileType ?? '',
            key: versionData.previousKey,
            url: versionData.previousUrl,
          } : null,
          token: this.selectedFileConfig?.token,
          url: this.selectedFileConfig?.document?.url ?? '',
          version: versionData.version,
        };
        
        event.data = historyData;
      },
      error: (error) => {
        console.error("Error fetching history data:", error);
      }
    });
  }

  onRequestRestore(event: any): void {

    

    this.documentService.restoreFileVersion(this.relativeFilePath, event.data.version).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        console.error("Error restoring version:", error);
        alert("Failed to restore file version.");
      }
    });
  }

  onRequestHistoryClose(): void {
    window.location.reload();
  }

  closeEditor(): void {
    this.selectedFileConfig = null;
  }
  private docEditor: any;
  connector: any = null;
  onDocumentReady(event: any): void {
    const documentEditor = (window as any).DocEditor?.instances?.["docxEditor"];
   if (documentEditor) {
    // Call a method on the editor instance, for example, to display a welcome message
    documentEditor.showMessage("Welcome to ONLYOFFICE Editor!");
  } else {
    console.error("Document editor instance 'docxEditor' not found.");
  }
   
  }
  
  onLoadComponentError(errorCode: number, errorDescription: string): void {
    console.error('Load Component Error:', errorCode, errorDescription);
  }
  
  openCreateFileModal() {
    this.isFileModalOpen = true;
    this.createFileForm.reset();
  }

  closeCreateFileModal() {
    this.isFileModalOpen = false;
  }

  openCreateFolderModal() {
    this.isFolderModalOpen = true;
    this.createFolderForm.reset();
  }

  closeCreateFolderModal() {
    this.isFolderModalOpen = false;
  }

  onSubmitCreateFolder() {
    if(this.createFolderForm.invalid){
      return;
    }
    const folderName = this.createFolderForm.value.folderName;
    // Call your service API – adjust parameters for your backend as needed.
    this.documentService.createFolder(this.currentPath, folderName).subscribe({
      next: (res) => {
        this.utilsService.showMessage('Folder created successfully!', 'success');
        this.closeCreateFolderModal();
        // Optionally refresh file list
        this.loadFiles(this.currentPath|| '.');
      },
      error: (err) => {
        this.utilsService.showMessage('Error creating folder.', 'error');
        console.error(err);
      }
    });
  }



  onSubmitCreateFile(): void {
    if (this.createFileForm.valid) {
      const { fileType, fileName } = this.createFileForm.value;
      const path = this.currentPath || '.';
      this.documentService.createFile(fileType, fileName, path ).subscribe(
        (response) => {
          const newFile = {
            name: fileName,
            type: 'File',
            size: 0, // You can set the actual size if available
            mark: false, // Default value, update as needed
            modified: new Date(), // Set the current date as modified date
            icon: this.getIcon({ type: 'File', name: fileName }) // Get the appropriate icon
          };
          this.items = [...this.items, newFile];
        }
      );
      this.closeCreateFileModal();
    }
  }

  openUploadFileModal(): void {
    const fileInput = document.getElementById('uploadFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // reset previous selection
      fileInput.click();
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray: File[] = Array.from(input.files);
      const path = this.currentPath || '.';
      this.documentService.uploadFiles(filesArray, path).subscribe(
        (response) => {
          // Optionally refresh the file list
          this.loadFiles(path);
        },
        (error) => {
          console.error('Error uploading files:', error);
          alert('Error uploading files.');
        }
      );
    }
  }


  openArchiveModal(): void {
    // Get selected rows from the datatable (ensure your datatable component provides this method)
    const selectedRows = this.datatable.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
     
      this.utilsService.showMessage('Please select at least one file to archive', 'error');
      return;
    }
    // Filter to only files (exclude folders)
    this.archiveSelectedFiles = selectedRows.filter((row: any) => row.type === 'File');
    if (this.archiveSelectedFiles.length === 0) {
     
      this.utilsService.showMessage('Only files can be archived.', 'error');
      return;
    }
    this.isArchiveModalOpen = true;
    this.archiveForm.reset();
  }

  closeArchiveModal(): void {
    this.isArchiveModalOpen = false;
  }

  onSubmitArchive(): void {
    if (this.archiveForm.invalid) {
      return;
    }
    const archiveName = this.archiveForm.value.archiveName;
    const filePaths = this.archiveSelectedFiles.map(file => file.path);
    const archivePath = this.currentPath || '.';
    this.documentService.archiveFiles(filePaths, archiveName,archivePath).subscribe({
      next: () => {
        this.utilsService.showMessage('Archive created successfully!', 'success');
        this.isArchiveModalOpen = false;
        // Refresh file list if needed
        this.loadFiles(archivePath);
      },
      error: (error) => {
        console.error('Error archiving files:', error);
        this.utilsService.showMessage('Error archiving files.', 'error');
      }
    });
  }

  closeSummaryPanel(): void {
    this.isSummaryPanelOpen = false;
  }

  openShareModal(): void {
    // Populate filePaths similar to archive file selection:
    const selectedRows = this.datatable.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      this.utilsService.showMessage('Please select at least one file to share.', 'error');
    
      return;
    }
    this.filePaths = selectedRows.map((row: any) => row.path);
    
    
    this.currentStep = 1;
    this.shareFormStep1.reset({ selectedUsers: [] });
    this.shareFormStep2.reset({ accessType: '', expiration: '' });
    this.isShareModalOpen = true;
  }
  
  closeShareModal(): void {
    this.isShareModalOpen = false;
  }


  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.shareFormStep1.invalid) {
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (this.shareFormStep2.invalid) {
        return;
      }
      const accessType = this.shareFormStep2.value.accessType;
      if ((accessType === '10' || accessType === '11') && !this.shareFormStep2.value.expiration) {
        // Expiration is required for access types 10 or 11.
        return;
      }
      this.shareFile(); // Now this method exists.
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  onUserSelect(event: any): void {
    const selectedUsers = this.shareFormStep1.value.selectedUsers as any[];
    const userId = event.target.value;
    if (event.target.checked) {
      selectedUsers.push(userId);
    } else {
      const index = selectedUsers.indexOf(userId);
      if (index > -1) {
        selectedUsers.splice(index, 1);
      }
    }
    this.shareFormStep1.patchValue({ selectedUsers });
  }

  onAccessTypeChange(): void {
    const accessType = this.shareFormStep2.value.accessType;
    if (accessType !== '10' && accessType !== '11') {
      this.shareFormStep2.patchValue({ expiration: '' });
    }
  }

  shareFile(): void {
    const sharedWithRaw = this.shareFormStep1.value.selectedUsers;
    // Convert selected user IDs to numbers for sharedWithUsers.
    const sharedWithUsers = sharedWithRaw.map((id: any) => Number(id));
    const accessTypeId = Number(this.shareFormStep2.value.accessType);
    let expirationTime = this.shareFormStep2.value.expiration;
    
    // If expirationTime is empty and accessTypeId is not 10 or 11, default to 1 day from now.
    if (!expirationTime && accessTypeId !== 10 && accessTypeId !== 11) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expirationTime = tomorrow.toISOString();
    } else if(expirationTime) {
      expirationTime = new Date(expirationTime).toISOString();
    }
    
    const payload = {
      filePaths: this.filePaths,
      sharedWithUsers: sharedWithUsers,
      accessTypeId: accessTypeId,
      expirationTime: expirationTime
    };
    
    console.debug("shareFile payload:", payload);
    
    this.documentService.fileShare(payload.filePaths, payload.sharedWithUsers,payload.accessTypeId.toString(),payload.expirationTime ).subscribe({
      next: () => {
        this.utilsService.showMessage('File shared successfully!', 'success');
        this.closeShareModal();
        this.shareCompleted.emit();
      },
      error: (error) => {
        console.error('Error sharing file:', error);
        this.utilsService.showMessage('Error sharing file.', 'error');
      }
    });
  }
  
  
  openDeleteModal(): void {
    const selectedRows = this.datatable.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      this.utilsService.showMessage('Please select at least one file or folder to delete.', 'error');
      return;
    }
    const filePaths: string[] = [];
    const folderPaths: string[] = [];
    
    // Aggregate paths based on type.
    for (const row of selectedRows) {
      if (row.type === 'File') {
        filePaths.push(row.path);
      } else if (row.type === 'Folder') {
        folderPaths.push(row.path);
      }
    }
    
    // Create an array of observables to use with forkJoin.
    const deletionObservables = [];
    if (filePaths.length > 0) {
      deletionObservables.push(this.documentService.DeleteFile(filePaths));
    }
    if (folderPaths.length > 0) {
      deletionObservables.push(this.documentService.Deletefolder(folderPaths));
    }
    
    forkJoin(deletionObservables).subscribe({
      next: () => {
        this.utilsService.showMessage('Selected items moved to trash successfully!', 'success');
        // Refresh the file list after deletion.
        this.loadFiles(this.currentPath || '.');
      },
      error: (error) => {
        console.error('Error deleting items:', error);
        this.utilsService.showMessage('Error deleting items.', 'error');
      }
    });
}

openSummaryPanel(file: any): void {
  console.log('File for summary:', file);
  this.isSummaryPanelOpen = true;
  this.isLoadingSummary = true;

  this.documentService.getSummary(file.name).subscribe({
    next: (response) => {
      console.log('Summary response:', response);
      this.documentSummary = response;
      this.isLoadingSummary = false;
      this.utilsService.showMessage('Summary Generated successfully!', 'success');
    },
    error: (error) => {
      console.error('Error fetching summary:', error);
      this.isLoadingSummary = false;
      this.utilsService.showMessage('Error Generating Summary file.', 'error');
    }
  });
}

  


  }













  
    
  
    
  





