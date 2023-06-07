import { createAction, props } from '@ngrx/store';
import { CarModel } from "../../shared/models/car.model";
import { BaseModel } from "../../shared/models/base.model";

export const createCar = createAction(
  '[CrashModel Component] Create car',
  props<{car: CarModel}>()
);

export const createCarSuccessful = createAction(
  '[Car API] Create successful',
  props<{car: CarModel}>()
);

export const loadCar = createAction(
  '[Car Component] Load car',
  props<{carId: string}>()
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


export const updateCarSubModelSuccessful = createAction(
  '[Car Effects] Update submodel',
  props<{carId: number, model: BaseModel}>()
);

export const updateCarSubModel = createAction(
  '[Car Component] Update car Sub model',
  props<{carId: number, model: BaseModel}>()
);

export const updateCarDamagedParts = createAction(
  '[VisibleDamageSelector Component] Update visible damage',
  props<{carId: number, damagedParts: string[]}>()
);

export const updateCarInitialImpact = createAction(
  '[PointOfInitialImpact Component] Update initial impact',
  props<{carId: number, initialImpacts: string[]}>()
);


