import { createAction, props } from '@ngrx/store';
import { CarModel } from "../../shared/models/car.model";

export const createCar = createAction(
  '[CrashModel Component] Create car',
  props<{car: CarModel}>()
);

export const createCarSuccessful = createAction(
  '[Car API] Create successful',
  props<{car: CarModel}>()
);

export const loadCars = createAction(
  '[CrashModel Store] Load cars'
);

export const loadCarsSuccessful = createAction(
  '[Car Api] Load cars Successful',
  props<{cars: CarModel[]}>()
);

export const deleteCar = createAction(
  '[CrashModel Component] Delete car',
  props<{carId: number}>()
);

export const deleteCarSuccessful = createAction(
  '[Car API] Delete car successful',
  props<{carId: number}>()
);

export const updateCar = createAction(
  '[CrashModel Component] Update car',
  props<{car: CarModel}>()
);

export const updateCarSuccessful = createAction(
  '[Car API] Update car successful',
  props<{car: CarModel}>()
);

