import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, tap } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { CrashesApiService } from "../../shared/api/crashes/crashes-api.service";
import { loadCrash, loadCrashSuccessful } from "./crash-action";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadCars } from "../car/car-action";
import { CarsApiService } from "../../shared/api/cars/cars-api.service";

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

  constructor(
    private actions$: Actions,
    private crashesApiService: CrashesApiService,
    private carsApiService: CarsApiService,
    private router: Router,
    private store: Store
  ) {}
}
