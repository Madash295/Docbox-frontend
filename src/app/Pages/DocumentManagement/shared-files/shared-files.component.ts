import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DocumentService } from '../document.service'; 

import { DocumentEditorModule, type IConfig } from '@onlyoffice/document-editor-angular';
import { UtilsService } from 'src/app/utils.service';
import path from 'path';
import { access } from 'fs';

@Component({
  selector: 'app-shared-files',
  standalone: true,
   imports: [CommonModule, DataTableModule, IconModule, FormsModule, DocumentEditorModule,ReactiveFormsModule],
  templateUrl: './shared-files.component.html',
  styleUrl: './shared-files.component.css'
})
export class SharedFilesComponent {
  tab2: string = 'shared';
  search = '';
  Shareditems: any[] = [];
  Sharedcols = [
    { field: 'name', title: 'Name' },
    { field: 'type', title: 'Type' },
    { field: 'size', title: 'Size' },
    { field: 'recipient', title: 'Recipient'},
    { field: 'accesstype', title: 'Access Type'},
    { field: 'modified', title: 'Last Modified' },
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  Receiveditems: any[] = [];
  Receivedcols = [
    { field: 'name', title: 'Name' },
    { field: 'type', title: 'Type' },
    { field: 'size', title: 'Size' },
    { field: 'sender', title: 'Sender'},
    { field: 'accesstype', title: 'Access Type'},
    { field: 'modified', title: 'Last Modified' },
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
  ];
  isSummaryPanelOpen = false;
  isLoadingSummary = false;
  documentSummary: string | null = null;
  selectedFileConfig: IConfig | null = null;
  constructor(private documentService: DocumentService, private fb: FormBuilder,private utilsService: UtilsService,) {
   

  }
  getIcon(type: string, name: string): string {
    console.debug('getIcon:', { type, name });
    name = name.toLowerCase();
    if (type === 'Folder') {
      return '/assets/images/folder.png';
    }
    if (type === 'File') {
      if (name.endsWith('.docx') || name.endsWith('.doc') || name.endsWith('.rtf')) {
        return '/assets/images/doc.png';
      }
      if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || name.endsWith('.ods')) {
        return '/assets/images/xls.png';
      }
      if (name.endsWith('.pptx') || name.endsWith('.ppt')) {
        return '/assets/images/ppt.png';
      }
      if (name.endsWith('.pdf')) {
        return '/assets/images/pdf.png';
      }
      if (name.endsWith('.zip')) {
        return '/assets/images/zip.png';
      }
    }
    return '/assets/icons/file-icon.png';
}

  ngOnChanges(): void {
    this.sharedFiles();
    this.receivedFiles();
  }
  ngOnInit(): void {
    this.sharedFiles();
    this.receivedFiles();
  }
  sharedFiles(): void {
    this.documentService.getSharedFiles().subscribe((data: any) => {
      this.Shareditems = data.map((item: any) => ({
        
        name: item.fileName,
        type: item.type,
        size: item.size,
        path: item.filePath,
        lastModified:item.lastModified,
        recipientid: item.sendToUserId,
        accesstype: item.accessType,
        recipient: item.sharedWith,
        icon: this.getIcon(item.type, item.fileName)  
      }));
      
      
    }
  )};
  receivedFiles(): void {
    this.documentService.getReceivedFiles().subscribe((data: any) => {
      this.Receiveditems = data.map((item: any) => ({
        name: item.fileName,
        type: item.type,
        size: item.size,
        path: item.filePath,
        fileid: item.fileSharingId,
        accesstype: item.accessType,
        lastModified:item.lastModified,
        sender: item.ownerUsername,
        icon: this.getIcon(item.type, item.fileName)  
      }));
    }
  )}
  openSummaryPanel(file: any): void {
    console.log('File for summary:', file);
    this.isSummaryPanelOpen = true;
    this.isLoadingSummary = true;
  
    this.documentService.getSummary(file.path).subscribe({
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
  opensharedSummaryPanel(file: any): void {
    console.log('File for summary:', file);
    this.isSummaryPanelOpen = true;
    this.isLoadingSummary = true;
  
    this.documentService.getsharedsummary(file.fileid).subscribe({
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
  handleRowClick(row: any): void {
   //   this.openFileInEditor(row);
  }  
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
  closeSummaryPanel(): void {
    this.isSummaryPanelOpen = false;
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


  opensharedEditor(file: any): void {
    if (!file || file.type !== 'File') return;
    
    this.documentService.opensharefile(file.fileid).subscribe({
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
  openrevokeaccess(file: any): void {
    console.log('File for summary:', file);
    this.documentService.revokeaccess(file.path, file.recipientid).subscribe({
      next: (response) => {
        this.utilsService.showMessage('Access revoked successfully!', 'success');
        this.sharedFiles();
      },
      error: (error :any) => {
        console.error('Error fetching summary:', error);
        this.utilsService.showMessage('Error revoking access.', 'error');
      }
    });

  }





}
