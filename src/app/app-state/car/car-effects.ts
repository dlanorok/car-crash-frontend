import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, filter, Observable, tap, withLatestFrom } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { CarsApiService } from "../../shared/api/cars/cars-api.service";
import {
  createCar,
  createCarSuccessful,
  deleteCar,
  deleteCarSuccessful, loadCar,
  loadCars,
  loadCarsSuccessful,
  updateCar, updateCarSubModel, updateCarSubModelSuccessful,
  updateCarSuccessful
} from "./car-action";
import { CarModel } from "../../shared/models/car.model";
import { addCar } from "../crash/crash-action";
import { Store } from "@ngrx/store";
import { selectCars } from "./car-selector";
import { PolicyHolderModel } from "@app/shared/models/policy-holder.model";
import { PolicyHoldersApiService } from "@app/shared/api/policy-holders/policy-holders-api.service";
import { InsuranceModel } from "@app/shared/models/insurance.model";
import { InsurancesApiService } from "@app/shared/api/insurances/insurances-api.service";
import { BaseModel } from "@app/shared/models/base.model";
import { DriverModel } from "@app/shared/models/driver.model";
import { DriversApiService } from "@app/shared/api/drivers/drivers-api.service";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";
import { CircumstancesApiService } from "@app/shared/api/circumstances/circumstances-api.service";

@Injectable()
export class CarEffects {

  createCar$ = createEffect(() => this.actions$.pipe(
      ofType(createCar),
      exhaustMap((action) => this.carApiService.create(action.car)
        .pipe(
          tap((car: CarModel) => this.store.dispatch(addCar({carId: car.id, addToMyCars: true}))),
          map(car => ({type: createCarSuccessful.type, car})),
          catchError(() => EMPTY)
        ))
    )
  );

  loadCars$ = createEffect(() => this.actions$.pipe(
      ofType(loadCars, loadCar),
      withLatestFrom(this.store.select(selectCars)),
      filter(([action, cars]) => !cars || cars.length === 0),
      exhaustMap(() => this.carApiService.getList()
        .pipe(
          tap((cars: CarModel[]) => this.store.dispatch(loadCarsSuccessful({cars: cars}))),
          map(cars => ({type: loadCarsSuccessful.type, cars})),
          catchError(() => EMPTY)
        ))
    )
  );

  deleteCar$ = createEffect(() => this.actions$.pipe(
      ofType(deleteCar),
      exhaustMap((action) =>
        this.carApiService.delete(action.carId)
          .pipe(
            map(() => ({type: deleteCarSuccessful.type, carId: action.carId})),
            catchError(() => EMPTY)
          ))
    )
  );

  updateCar$ = createEffect(() => this.actions$.pipe(
      ofType(updateCar),
      exhaustMap((action) =>
        this.carApiService.put(action.car)
          .pipe(
            map(() => ({type: updateCarSuccessful.type, car: action.car})),
            catchError(() => EMPTY)
          ))
    )
  );

  updateCarSubModel$ = createEffect(() => this.actions$.pipe(
      ofType(updateCarSubModel),
      exhaustMap((action) => {
        let obs$: Observable<BaseModel> | null = null;

        if (action.model instanceof CarModel) {
          obs$ = this.carApiService.create(action.model);
        } else if (action.model instanceof PolicyHolderModel) {
          obs$ = this.policyHoldersApiService.create(action.model);
        } else if (action.model instanceof InsuranceModel) {
          obs$ = this.insurancesApiService.create(action.model);
        } else if (action.model instanceof DriverModel) {
          obs$ = this.driversApiService.create(action.model);
        } else if (action.model instanceof CircumstanceModel) {
          obs$ = this.circumstancesApiService.create(action.model);
        }

        if (!obs$) {
          return EMPTY;
        }

        return obs$
          .pipe(
            tap((model: BaseModel) => this.store.dispatch(updateCarSubModelSuccessful({carId: action.carId, model: model}))),
            map((model: BaseModel) => ({type: updateCarSubModel.type, model: model})),
            catchError(() => EMPTY)
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private carApiService: CarsApiService,
    private router: Router,
    private store: Store,
    private policyHoldersApiService: PolicyHoldersApiService,
    private insurancesApiService: InsurancesApiService,
    private driversApiService: DriversApiService,
    private circumstancesApiService: CircumstancesApiService
  ) {
  }
}
