import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DocumentService } from '../document.service'; // Ensure the service path is correct

import { NgSelectModule } from '@ng-select/ng-select';
import { DocumentEditorModule, type IConfig } from '@onlyoffice/document-editor-angular';


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
  cols = [
    { field: 'name', title: 'Name' },
    { field: 'type', title: 'Type' },
    { field: 'size', title: 'Size' },
    { field: 'mark', title: 'Important'},
    { field: 'modified', title: 'Last Modified' },
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  items: any[] = [];
  createFileForm: FormGroup;

  folderStack: string[] = []; // Stack to manage folder navigation
  currentPath: string = ''; // Stores the current path as breadcrumb
  pathHistory: any[] = []; // Store JSON structure for folder paths
  selectedFileConfig: IConfig | null = null;
  fileTypes = [
    { value: 'document', label: 'Document (.docx)' },
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'ppt', label: 'PowerPoint (.pptx)' }
  ];

  constructor(private documentService: DocumentService, private fb: FormBuilder) {
    this.createFileForm = this.fb.group({
      fileType: ['document', Validators.required],
      fileName: ['', Validators.required]
    });

  }


  ngOnInit(): void {
    this.loadFiles('.');
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
  openCreateFileModal(): void {
    this.isModalOpen = true;
  }

  closeCreateFileModal(): void {
    this.isModalOpen = false;
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

  // Editor HTML container
  
}
