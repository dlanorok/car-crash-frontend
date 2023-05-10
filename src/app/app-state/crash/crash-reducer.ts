import { createReducer, on } from '@ngrx/store';
import { Crash } from "../../shared/models/crash.model";
import { addCar, createCrash, createCrashSuccessful, loadCrash, loadCrashSuccessful } from "./crash-action";

export interface CrashState {
  crash?: Crash
}

export const initialState: CrashState = {
  crash: undefined,
};

export const crashReducer = createReducer(
  initialState,
  on(createCrash, (state) => {
    return {
      ...state
    }
  }),
  on(createCrashSuccessful, (state, { crash }) => {
    return {
      ...state,
      crash: crash
    }
  }),
  on(addCar, (state, { carId }) => ({
    ...state,
    crash: { ...state.crash, cars: [...state.crash?.cars || [], carId]} as Crash
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
