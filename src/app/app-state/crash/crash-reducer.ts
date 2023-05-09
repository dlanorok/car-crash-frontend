import { createReducer, on } from '@ngrx/store';
import { Crash } from "../../shared/models/crash.model";
import { addCar, createCrash, loadCrash, loadCrashSuccessful } from "./crash-action";

export interface CrashState {
  crash?: Crash
}

export const initialState: CrashState = {
  crash: undefined,
};

export const crashReducer = createReducer(
  initialState,
  on(createCrash, (state, { crash }) => {
    localStorage.setItem('session_id', crash.session_id);
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
    localStorage.setItem('session_id', crash.session_id);
    return {
      ...state,
      crash: crash
    }
  }),
);
