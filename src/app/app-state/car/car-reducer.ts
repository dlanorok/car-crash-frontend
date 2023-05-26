import { createReducer, on } from '@ngrx/store';
import { CarModel } from "../../shared/models/car.model";
import {
  createCar,
  createCarSuccessful,
  deleteCarSuccessful,
  loadCarsSuccessful,
  updateCarSuccessful
} from "./car-action";

export interface CarState {
  cars: CarModel[]
}

export const initialState: CarState = {
  cars: [],
};

export const carReducer = createReducer(
  initialState,
  on(createCar, (state) => {
    return {
      ...state
    };
  }),
  on(createCarSuccessful, (state, { car }) => {
    return {
      ...state,
      cars: [...state.cars, car]
    };
  }),
  on(deleteCarSuccessful, (state, { carId }) => {
    return {
      ...state,
      cars: [...state.cars.filter(car => car.id !== carId)]
    };
  }),
  on(loadCarsSuccessful, (state, { cars }) => {
    return {
      ...state,
      cars: [...cars]
    };
  }),
  on(updateCarSuccessful, (state, { car }) => {
    return {
      ...state,
      cars: [...state.cars.map(_car => {
        if (car.id === _car.id) {
          return car;
        }
        return _car;
      })]
    };
  }),
);
