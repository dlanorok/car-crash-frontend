import { createReducer, on } from '@ngrx/store';
import { CrashModel } from "../../shared/models/crash.model";
import { addCar, createCrash, createCrashSuccessful, loadCrash, loadCrashSuccessful } from "./crash-action";

export interface CrashState {
  crash: CrashModel
}

export const initialState: CrashState = {
  crash: new CrashModel(),
};

export const crashReducer = createReducer(
  initialState,
  on(createCrashSuccessful, (state, { crash }) => {
    return {
      ...state,
      crash: crash
    }
  }),
  on(addCar, (state, { carId }) => ({
    ...state,
    crash: { ...state.crash, cars: [...state.crash?.cars || [], carId]} as CrashModel
  })),
  on(loadCrash, (state, { sessionId}) => ({
    ...state
  })),
  on(loadCrashSuccessful, (state, { crash }) => {
    return {
      ...state,
      crash: crash
    }
  }),
);
