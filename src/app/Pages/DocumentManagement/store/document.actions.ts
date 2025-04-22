import { createAction, props } from '@ngrx/store';

export const loadFiles = createAction('[File] Load Files', props<{ path: string }>());
export const loadFilesSuccess = createAction('[File] Load Files Success', props<{ files: any[] }>());
export const loadFilesFailure = createAction('[File] Load Files Failure', props<{ error: any }>());

export const addFile = createAction('[File] Add File', props<{ fileType:string,fileName:string,path:string}>());
export const addFileSuccess = createAction('[File] Add File Success', props<{ file: any }>());
export const addFileFailure = createAction('[File] Add File Failure', props<{ error: any }>());