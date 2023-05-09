import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { CrashesApiService } from "../../shared/api/crashes/crashes-api.service";
import { loadCrash, loadCrashSuccessful } from "./crash-action";

@Injectable()
export class CrashEffects {

  loadCrashes$ = createEffect(() => this.actions$.pipe(
      ofType(loadCrash),
      exhaustMap((action) => this.crashesApiService.getSingle(action.sessionId)
        .pipe(
          map(crash => ({ type: loadCrashSuccessful.type, crash })),
          catchError(() => EMPTY)
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private crashesApiService: CrashesApiService
  ) {}
}
