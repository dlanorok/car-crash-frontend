import { createReducer, on } from '@ngrx/store';
import { CarModel } from "../../shared/models/car.model";
import { createCar, createCarSuccessful, loadCarsSuccessful } from "./car-action";

export interface CarState {
  cars: CarModel[]
}

export const initialState: CarState = {
  cars: [],
};

export const carReducer = createReducer(
  initialState,
  on(createCar, (state, { crashSessionId }) => {
    return {
      ...state
    }
  }),
  on(createCarSuccessful, (state, { car }) => {
    return {
      ...state,
      cars: [...state.cars, car]
    }
  }),
  on(loadCarsSuccessful, (state, { cars }) => {
    return {
      ...state,
      cars: [...cars]
    }
  })
);
