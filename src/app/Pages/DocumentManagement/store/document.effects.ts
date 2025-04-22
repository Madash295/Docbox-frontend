import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DocumentService } from '../document.service';
import * as DocumentActions from './document.actions';

@Injectable()
export class FileEffects {
  loadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.loadFiles),
      mergeMap(action =>
        this.documentService.getListFiles(action.path).pipe(
          map(files => DocumentActions.loadFilesSuccess({ files })),
          catchError(error => of(DocumentActions.loadFilesFailure({ error })))
        )
      )
    )
  );

  addFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.addFile),
      mergeMap(action =>
        this.documentService.createFile(action.fileName, action.fileType, action.path).pipe(
          map(file => DocumentActions.addFileSuccess({ file })),
          catchError(error => of(DocumentActions.addFileFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private documentService: DocumentService
  ) {}
}