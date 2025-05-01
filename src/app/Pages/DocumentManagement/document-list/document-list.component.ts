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


  isCopyModalOpen: boolean = false;
  copyDestinationPath: string = '.';
  copySelectedFiles: any[] = [];

  
  isMoveModalOpen: boolean = false;
  moveDestinationPath: string = '.';
  moveSelectedFiles: any[] = [];

 
  destinationItems: any[] = [];

  // Overwrite
  isOverwriteConfirmOpen: boolean = false;
  pendingOperation: 'copy' | 'move' | null = null;
  pendingDestinationPath: string = '';
  pendingFilePaths: string[] = [];











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
      if (item.name.endsWith('.docx')|| item.name.endsWith('.doc')|| item.name.endsWith('.rtf')) {
        return '/assets/images/doc.png'; // Replace with actual doc icon path
      }
      if (item.name.endsWith('.xlsx') || item.name.endsWith('.xls')|| item.name.endsWith('.csv')|| item.name.endsWith('.ods')) {
        return '/assets/images/xls.png'; // Replace with actual xls icon path
      }
      if (item.name.endsWith('.pptx') || item.name.endsWith('.ppt')) {
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
      error: (error : any) => {
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
      error: (error :any) => {
        console.error("Error fetching history data:", error);
      }
    });
  }

  onRequestRestore(event: any): void {

    console.log("relativeFilePath",this.relativeFilePath)
    const version = event.data.version;
    
    this.documentService.restoreFileVersion(this.relativeFilePath, version).subscribe({
      next: () => {
        const file = { path: this.relativeFilePath, type: 'File' };
        this.openFileInEditor(file);
      },
      error: (error) => {
        console.error("Error restoring version:", error);
        alert("Failed to restore file version.");
      }
    });
  }



  onRequestHistoryClose(): void {
    const file = { path: this.relativeFilePath, type: 'File' };
    this.openFileInEditor(file);
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

  openEditor(file: any): void {
    if (!file || file.type !== 'File') return;
    
    this.documentService.openeditfile(file.path).subscribe({
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
          this.utilsService.showMessage('Files uploaded successfully!', 'success');
        
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

  searchTerm = '';
  isFilterPanelOpen = false;
  fuzzySearch = false;
  searchWithinFiles = false;
  includeImages = false;
  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  applyFilters(): void {
    this.isFilterPanelOpen = false; // Close the filter panel
    this.onSearchChange(this.searchTerm, this.fuzzySearch, this.searchWithinFiles, this.includeImages);
  }

  // onSearchChange(searchTerm: string): void {
  //  if(searchTerm.length > 3) {
  //     this.documentService.searchFiles(searchTerm, true, true, false).subscribe(
  //       (response: any) => {
  //         this.items = response.results.map((result: any) => ({
  //           name: result.fileName,
  //           path: result.relativePath,
  //           type: 'File', 
  //           icon: this.getIcon({ type: 'File', name: result.fileName }),
  //           modified: new Date().toISOString(), 
  //           size: 'N/A' 
  //         }));
  //       },
  //       (error) => {
  //         console.error('Error searching files:', error);
  //       }
  //     );
  //   }
  // }

  onSearchChange(
    searchTerm: string,
    fuzzySearch: boolean = false,
    searchWithinFiles: boolean = false,
    includeImages: boolean = false
  ): void {
    if (searchTerm.length > 0) {
      this.documentService
        .searchFiles(searchTerm, fuzzySearch, searchWithinFiles, includeImages)
        .subscribe(
          (response: any) => {
            this.items = response.results.map((result: any) => ({
              name: result.fileName,
              path: result.relativePath,
              type: 'File',
              icon: this.getIcon({ type: 'File', name: result.fileName }),
              modified: new Date().toISOString(),
              size: 'N/A',
            }));
          },
          (error) => {
            console.error('Error searching files:', error);
          }
        );
      }
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
    error: (error :any) => {
      console.error('Error fetching summary:', error);
      this.isLoadingSummary = false;
      this.utilsService.showMessage('Error Generating Summary file.', 'error');
    }
  });
}


opencopyfilemodal(): void {
  const selectedRows = this.datatable.getSelectedRows();
  this.copySelectedFiles = selectedRows.filter((row: any) => row.type === 'File');
  if(this.copySelectedFiles.length === 0){
      this.utilsService.showMessage('Please select at least one file to copy.', 'error');
      return;
  }
  this.copyDestinationPath = '.';
  this.loadDestinationItems(this.copyDestinationPath);
  this.isCopyModalOpen = true;
}

openmovefilemodal(): void {
  const selectedRows = this.datatable.getSelectedRows();
  this.moveSelectedFiles = selectedRows.filter((row: any) => row.type === 'File');
  if(this.moveSelectedFiles.length === 0){
      this.utilsService.showMessage('Please select at least one file to move.', 'error');
      return;
  }
  this.moveDestinationPath = '.';
  this.loadDestinationItems(this.moveDestinationPath);
  this.isMoveModalOpen = true;
}

loadDestinationItems(path: string): void {
  this.documentService.getListFiles(path).subscribe(
      (response: any) => {
          // Display all items so that the user can navigate folders.
          this.destinationItems = response.contents;
      },
      (error :any) => {
          console.error('Error loading destination items:', error);
      }
  );
}

navigateDestinationFolder(item: any): void {
  if(item.type === 'Folder'){
      // Update active destination path based on which modal is open.
      if(this.copyModalActive()){
          this.copyDestinationPath = this.copyDestinationPath === '.' ? item.name : this.copyDestinationPath + '/' + item.name;
      } else {
          this.moveDestinationPath = this.moveDestinationPath === '.' ? item.name : this.moveDestinationPath + '/' + item.name;
      }
      this.loadDestinationItems(this.getActiveDestinationPath());
  }
}

goBackDestination(): void {
  let currentPath = this.getActiveDestinationPath();
  const parts = currentPath === '.' ? [] : currentPath.split('/');
  parts.pop();
  const newPath = parts.length ? parts.join('/') : '.';
  if(this.copyModalActive()){
      this.copyDestinationPath = newPath;
  } else {
      this.moveDestinationPath = newPath;
  }
  this.loadDestinationItems(newPath);
}

getActiveDestinationPath(): string {
  return this.copyModalActive() ? this.copyDestinationPath : this.moveDestinationPath;
}

copyModalActive(): boolean {
  return this.isCopyModalOpen;
}

pasteFiles(): void {
  const destinationPath = this.getActiveDestinationPath();
  // Get file paths from the active modal's file list.
  const filePaths = (this.copyModalActive() ? this.copySelectedFiles : this.moveSelectedFiles).map(f => f.path);
  // Save pending values in case overwrite is needed.
  this.pendingDestinationPath = destinationPath;
  this.pendingFilePaths = filePaths;
  this.pendingOperation = this.copyModalActive() ? 'copy' : 'move';

  if (this.pendingOperation === 'copy') {
      this.documentService.Copyfile(filePaths, destinationPath, false).subscribe({
          next: () => {
              this.utilsService.showMessage('Files copied successfully!', 'success');
              this.closeAllModals();
              this.loadFiles(this.currentPath || '.');
          },
          error: (error) => {
              if (error.status === 409) {
                  this.isOverwriteConfirmOpen = true;
              } else {
                  console.error('Error copying files:', error);
                  this.utilsService.showMessage('Error copying files.', 'error');
              }
          }
      });
  } else if (this.pendingOperation === 'move') {
      // Instead of calling Movefile, perform copy then delete
      this.documentService.Copyfile(filePaths, destinationPath, false).subscribe({
          next: () => {
              // After copy succeeds, delete the originals.
              this.documentService.DeleteFile(filePaths).subscribe({
                  next: () => {
                      this.utilsService.showMessage('Files moved successfully!', 'success');
                      this.closeAllModals();
                      this.loadFiles(this.currentPath || '.');
                  },
                  error: (error: any) => {
                      console.error('Error deleting original files:', error);
                      this.utilsService.showMessage('Error moving files.', 'error');
                  }
              });
          },
          error: (error: any) => {
              if (error.status === 409) {
                  this.isOverwriteConfirmOpen = true;
              } else {
                  console.error('Error moving files:', error);
                  this.utilsService.showMessage('Error moving files.', 'error');
              }
          }
      });
  }
}

confirmOverwrite(overwrite: boolean): void {
  this.isOverwriteConfirmOpen = false;
  if (overwrite) {
      if (this.pendingOperation === 'copy') {
          this.documentService.Copyfile(this.pendingFilePaths, this.pendingDestinationPath, true).subscribe({
              next: () => {
                  this.utilsService.showMessage('Files copied (with overwrite) successfully!', 'success');
                  this.closeAllModals();
                  this.loadFiles(this.currentPath || '.');
              },
              error: (error) => {
                  console.error('Error copying files with overwrite:', error);
                  this.utilsService.showMessage('Error copying files.', 'error');
              }
          });
      } else if (this.pendingOperation === 'move') {
          // First, copy with overwrite then delete originals.
          this.documentService.Copyfile(this.pendingFilePaths, this.pendingDestinationPath, true).subscribe({
              next: () => {
                  this.documentService.DeleteFile(this.pendingFilePaths).subscribe({
                      next: () => {
                          this.utilsService.showMessage('Files moved (with overwrite) successfully!', 'success');
                          this.closeAllModals();
                          this.loadFiles(this.currentPath || '.');
                      },
                      error: (error: any) => {
                          console.error('Error deleting original files after move:', error);
                          this.utilsService.showMessage('Error moving files.', 'error');
                      }
                  });
              },
              error: (error: any) => {
                  console.error('Error moving files with overwrite:', error);
                  this.utilsService.showMessage('Error moving files.', 'error');
              }
          });
      }
  }
}

cancelOverwrite(): void {
  this.isOverwriteConfirmOpen = false;
  this.pendingOperation = null;
  this.pendingFilePaths = [];
  this.pendingDestinationPath = '';
}

closeAllModals(): void {
  this.isCopyModalOpen = false;
  this.isMoveModalOpen = false;
  this.isOverwriteConfirmOpen = false;
}


opendownloadmodal(file: any): void {
  this.documentService.downloadfile(file.path).subscribe({
    next: (response: Blob) => {
      const blobUrl = window.URL.createObjectURL(response);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = file.name; // use the file name for download
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
      this.utilsService.showMessage('Download started successfully!', 'success');
    },
    error: (error) => {
      console.error('Error downloading file:', error);
      this.utilsService.showMessage('Error downloading file.', 'error');
    }
  });

}





  }













  
    
  
    
  





