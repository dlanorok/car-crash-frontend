import { createReducer, on } from '@ngrx/store';
import { CrashModel } from "../../shared/models/crash.model";
import {
  addCar, crashUpdateWS,
  createCrash,
  createCrashSuccessful,
  loadCrash,
  loadCrashSuccessful,
  updateCrash
} from "./crash-action";

export interface CrashState {
  crash: CrashModel
  isLoading: boolean
}

export const initialState: CrashState = {
  crash: new CrashModel(),
  isLoading: false
};

export const crashReducer = createReducer(
  initialState,
  on(createCrashSuccessful, (state, {crash}) => {
    return {
      ...state,
      crash: crash,
      isLoading: false
    };
  }),
  on(createCrash, (state, {crash}) => {
    return {
      ...state,
      isLoading: true
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
  on(addCar, (state, {carId, addToMyCars}) => {
    return {
      ...state,
      crash: {
        ...state.crash,
        cars: [...state.crash?.cars || [], carId],
        my_cars: addToMyCars ? [...state.crash?.my_cars || [], carId] : [...state.crash.my_cars || []]
      } as CrashModel
    };
  }),
  on(loadCrash, (state) => ({
    ...state
  })),
  on(loadCrashSuccessful, (state, { crash }) => {
    return {
      ...state,
      crash: crash
    };
  }),
  on(crashUpdateWS, (state, {crash}) => {
    return {
      ...state,
      crash: {
        ...crash,
        my_cars: [...state.crash.my_cars || []],
      }
    };
  })
);
