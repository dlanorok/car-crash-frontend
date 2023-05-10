import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, pipe, tap } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { CrashesApiService } from "../../shared/api/crashes/crashes-api.service";
import { createCrash, createCrashSuccessful, loadCrash, loadCrashSuccessful } from "./crash-action";
import { Crash } from "../../shared/models/crash.model";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadCars } from "../car/car-action";

@Injectable()
export class CrashEffects {

  loadCrashes$ = createEffect(() => this.actions$.pipe(
      ofType(loadCrash),
      tap(() => this.store.dispatch(loadCars())),
      exhaustMap((action) => this.crashesApiService.getSingle(action.sessionId)
        .pipe(
          map(crash => ({ type: loadCrashSuccessful.type, crash })),
          catchError(() => EMPTY)
        ))
    )
  );

  createCrash$ = createEffect(() => this.actions$.pipe(
      ofType(createCrash),
      exhaustMap((action) => this.crashesApiService.create(new Crash())
        .pipe(
          tap((crash: Crash) => {
            this.router.navigate([`/crash/${crash.session_id}`])
          }),
          map(crash => ({ type: createCrashSuccessful.type, crash })),
          catchError(() => EMPTY)
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private crashesApiService: CrashesApiService,
    private router: Router,
    private store: Store
  ) {}
}
