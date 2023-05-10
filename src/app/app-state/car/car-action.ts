import { createAction, props } from '@ngrx/store';
import { CarModel } from "../../shared/models/car.model";

export const createCar = createAction(
  '[Crash Component] Create car',
  props<{crashSessionId: number}>()
);

export const createCarSuccessful = createAction(
  '[Car API] Create successful',
  props<{car: CarModel}>()
);

export const loadCars = createAction(
  '[Crash Store] Load cars'
);

export const loadCarsSuccessful = createAction(
  '[Car Api] Load cars Successful',
  props<{cars: CarModel[]}>()
);

