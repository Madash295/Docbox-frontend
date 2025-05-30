import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Ensure HttpParams is imported
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
// import { User } from '../../../../models/user.model';
import { baseURL } from '../../environments/dev_baseURL';
import path from 'path';
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
  getSharedFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/File/sent-shared-files`);
  }
  getReceivedFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/File/received-shared-files`);
  }
  createFile(fileType: string, fileName: string, path: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/File/create-file`, {fileType,fileName,path});
  }


  uploadFiles(files: File[], path: string): Observable<any> {
   
    const formData: FormData = new FormData();
    files.forEach(file => formData.append('files', file, file.name));
    return this.http.post(`${this.apiUrl}/File/upload?path=${encodeURIComponent(path)}`, formData, { responseType: 'text' });
}





  openFile(path: string): Observable<any> {
    const params = new HttpParams().set('path', path);
    return this.http.get(`${this.apiUrl}/File/open-viewfile`, { params });
  }
   openeditfile(path: string): Observable<any> {
    const params = new HttpParams().set('path', path);
    return this.http.get(`${this.apiUrl}/File/open-file`, { params });
  }

  opensharefile(id: number): Observable<any> {
    const params = new HttpParams().set('fileSharingId', id.toString());
    return this.http.get(`${this.apiUrl}/File/open-shared-file`, { params });
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

  restoreFileVersion(filePaths: string, version: string): Observable<any> {
    const versionTypInt = parseInt(version);
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    return this.http.post(
      `${this.apiUrl}/File/restore-version?filePath=${encodeURIComponent(filePaths)}&version=${versionTypInt}`,
      {}, // empty body
      { headers });
}


 createFolder(path: string, folderName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/File/create-folder`, { path, foldername: folderName });
  }

  archiveFiles(filePaths: string[], archiveName: string,path: string): Observable<any> {
    const body = {
      filePaths: filePaths,
      archiveName: archiveName,
      path: path
    };
    return this.http.post(`${this.apiUrl}/File/archive-files`, body);
  }
  searchFiles(searchText: string, fuzzySearch: boolean, searchWithinFiles: boolean, includeImages: boolean): Observable<any> {
    const params = new HttpParams()
      .set('query', searchText)
      .set('fuzzySearch', fuzzySearch.toString())
      .set('searchWithinFiles', searchWithinFiles.toString())
      .set('includeImages', includeImages.toString());
    return this.http.get(`${this.apiUrl}/File/search`, { params });
  }
  getSummary(fileName: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/File/summarize?fileName=${fileName}`, { responseType: 'text' });
  }
  
  getsharedsummary(fileSharingId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/File/summarize-shared-file?fileSharingId=${fileSharingId}`, { responseType: 'text' });
  }
  listUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/File/list-users`);
}
  Deletefolder (path: string[]): Observable<any> {
    const body = {
      path: path
    };
  
  return this.http.post(`${this.apiUrl}/File/delete-folders`,body);
}

 DeleteFile(path: string[]): Observable<any> {
  
  const body = {
    path: path
  };

  return this.http.post(`${this.apiUrl}/File/delete-file`,body);
}


  fileShare(filePaths: string[], sharedWith: string[], accesstype: string ,expiration : string): Observable<any> {
    const accesstypeInt = parseInt(accesstype);
    const body = {
      filePaths: filePaths,
      sharedWithUsers: sharedWith,
      accessTypeId: accesstypeInt,
      expirationTime: expiration
    };
    return this.http.post(`${this.apiUrl}/File/share-file`, body);
  }


  Copyfile(filePaths: string[], destinationPath: string ,overwrite:boolean): Observable<any> {
    const body = {
      sourcePaths: filePaths,
      destinationPath: destinationPath,
      overwriteExisting: overwrite
    };
    return this.http.post(`${this.apiUrl}/File/copy-files`, body);
  }


  Movefile(filePaths: string[], destinationPath: string ,overwrite:boolean): Observable<any> {
    const body = {
      sourcePaths: filePaths,
      destinationPath: destinationPath,
      overwriteExisting: overwrite
    };
    return this.http.post(`${this.apiUrl}/File/move-files`, body);
  }


  downloadfile(filePath: string): Observable<any> {
    const params = new HttpParams().set('path', filePath);
    return this.http.get(`${this.apiUrl}/File/download`, { params, responseType: 'blob' });
  }



  revokeaccess(filePath: string, sharedWithUserId: number): Observable<any> {
    const body = {
      filePath: filePath,
      sharedWithUserId: sharedWithUserId
    };
    return this.http.delete(`${this.apiUrl}/File/revoke-sharing`, { body });
  }


}
