import { createAction, props } from '@ngrx/store';
import { CrashModel } from "../../shared/models/crash.model";

export const createCrash = createAction(
  '[CreateCrash Component] Create',
  props<{crash: CrashModel}>()
);

export const createCrashSuccessful = createAction(
  '[CrashModel Api] Create CrashModel Successful',
  props<{crash: CrashModel}>()
);

export const loadCrash = createAction(
  '[CrashModel Component] Load',
  props<{sessionId: string}>()
);

export const updateCrash = createAction(
  '[AccidentData Component] Update',
  props<{crash: CrashModel}>()
);

export const loadCrashSuccessful = createAction(
  '[CrashModel API] CrashModel Load Success',
  props<{crash: CrashModel}>()
);

export const addCar = createAction(
  '[Car store] Add Car',
  props<{carId: number}>()
);
