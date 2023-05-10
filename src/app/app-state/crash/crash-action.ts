import { createAction, props } from '@ngrx/store';
import { Crash } from "../../shared/models/crash.model";

export const createCrash = createAction(
  '[CreateCrash Component] Create'
);

export const createCrashSuccessful = createAction(
  '[Crash Api] Create Crash Successful',
  props<{crash: Crash}>()
);

export const loadCrash = createAction(
  '[Crash Component] Load',
  props<{sessionId: string}>()
);

export const loadCrashSuccessful = createAction(
  '[Crash API] Crash Load Success',
  props<{crash: Crash}>()
);

export const addCar = createAction(
  '[Car store] Add Car',
  props<{carId: number}>()
);
