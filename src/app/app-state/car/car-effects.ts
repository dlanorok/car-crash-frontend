import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, tap } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { CarsApiService } from "../../shared/api/cars/cars-api.service";
import {
  createCar,
  createCarSuccessful,
  deleteCar,
  deleteCarSuccessful,
  loadCars,
  loadCarsSuccessful
} from "./car-action";
import { CarModel } from "../../shared/models/car.model";
import { addCar } from "../crash/crash-action";
import { Store } from "@ngrx/store";

@Injectable()
export class CarEffects {

  createCar$ = createEffect(() => this.actions$.pipe(
      ofType(createCar),
      exhaustMap((action) => this.carApiService.create(new CarModel({crash: action.crashSessionId}))
        .pipe(
          tap((car: CarModel) => this.store.dispatch(addCar({ carId: car.id }))),
          map(car => ({ type: createCarSuccessful.type, car })),
          catchError(() => EMPTY)
        ))
    )
  );

  loadCars$ = createEffect(() => this.actions$.pipe(
      ofType(loadCars),
      exhaustMap(() => this.carApiService.getList()
        .pipe(
          map(cars => ({ type: loadCarsSuccessful.type, cars })),
          catchError(() => EMPTY)
        ))
    )
  );

  deleteCar$ = createEffect(() => this.actions$.pipe(
      ofType(deleteCar),
      exhaustMap((action) =>
        this.carApiService.delete(action.carId)
          .pipe(
            map(() => ({ type: deleteCarSuccessful.type, carId: action.carId })),
            catchError(() => EMPTY)
          ))
    )
  );

  constructor(
    private actions$: Actions,
    private carApiService: CarsApiService,
    private router: Router,
    private store: Store
  ) {}
}
