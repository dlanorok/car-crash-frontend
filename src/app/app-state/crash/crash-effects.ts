import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, filter, mergeMap, tap, withLatestFrom } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { CrashesApiService } from "../../shared/api/crashes/crashes-api.service";
import { createCrash, loadCrash, loadCrashSuccessful, updateCrash } from "./crash-action";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CarsApiService } from "../../shared/api/cars/cars-api.service";
import { CrashModel } from "../../shared/models/crash.model";
import { selectCrash } from "./crash-selector";
import { CarModel } from "../../shared/models/car.model";

@Injectable()
export class CrashEffects {

  loadCrashes$ = createEffect(() => this.actions$.pipe(
      ofType(loadCrash),
      withLatestFrom(this.store.select(selectCrash)),
      filter(([action, crash]) => !crash.id),
      exhaustMap(([action, crash]) => this.crashesApiService.getSingle(action.sessionId)
        .pipe(
          map(crash => ({type: loadCrashSuccessful.type, crash})),
          catchError(() => EMPTY)
        ))
    )
  );

  updateCrash$ = createEffect(() => this.actions$.pipe(
      ofType(updateCrash),
      withLatestFrom(this.store.select(selectCrash)),
      exhaustMap(([action, crash]) => this.crashesApiService.put({
        ...crash,
        ...action.crash
      })
        .pipe(
          map(crash => ({type: loadCrashSuccessful.type, crash})),
          catchError(() => EMPTY)
        ))
    )
  );

  createCrash$ = createEffect(() => this.actions$.pipe(
      ofType(createCrash),
      exhaustMap((action) => this.crashesApiService.create(action.crash)
        .pipe(
          mergeMap((crash: CrashModel) => {
            return this.carsApiService.create(new CarModel({crash: crash.id}))
              .pipe(map((car: CarModel) => {
                crash.cars?.push(car.id);
                crash.my_cars?.push(car.id);
                return crash;
              }));
          }),
          tap((crash: CrashModel) => {
            this.router.navigate([`/crash/${crash.session_id}`]);
          }),
          map(crash => ({type: loadCrashSuccessful.type, crash})),
          catchError(() => EMPTY)
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private crashesApiService: CrashesApiService,
    private carsApiService: CarsApiService,
    private router: Router,
    private store: Store,

  ) {
  }
}
