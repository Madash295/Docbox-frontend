import { createReducer, on } from '@ngrx/store';
import * as FileActions from './document.actions';

export interface DocumentState {
  files: any[];
  error: any;
}

export const initialState: DocumentState = {
  files: [],
  error: null,
};

export const fileReducer = createReducer(
  initialState,
  on(FileActions.loadFilesSuccess, (state, { files }) => ({ ...state, files })),
  on(FileActions.loadFilesFailure, (state, { error }) => ({ ...state, error })),
  on(FileActions.addFileSuccess, (state, { file }) => ({ ...state, files: [...state.files, file] })),
  on(FileActions.addFileFailure, (state, { error }) => ({ ...state, error }))
);