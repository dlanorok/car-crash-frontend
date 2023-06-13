import { createReducer, on } from '@ngrx/store';
import { CrashModel } from "../../shared/models/crash.model";
import { addCar, createCrashSuccessful, loadCrash, loadCrashSuccessful, updateCrash } from "./crash-action";

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
    };
  }),
  on(updateCrash, (state, {crash}) => {
    return {
      ...state,
      crash: {
        ...state.crash,
        ...crash
      }
    };
  }),
  on(addCar, (state, { carId }) => ({
    ...state,
    crash: {
      ...state.crash,
      cars: [...state.crash?.cars || [], carId],
      my_cars: [...state.crash?.my_cars || [], carId]
    } as CrashModel
  })),
  on(loadCrash, (state) => ({
    ...state
  })),
  on(loadCrashSuccessful, (state, { crash }) => {
    return {
      ...state,
      crash: crash
    };
  }),
);
