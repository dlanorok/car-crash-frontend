import { CarState } from "./car-reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const featureKey = 'carStore';

export const selectCarState = createFeatureSelector<CarState>(featureKey);
export const selectCars = createSelector(
  selectCarState,
  (state: CarState) => state.cars
);

export const selectCar = createSelector(
  selectCarState,
  (state: CarState, id: string | number) => {
    return state.cars.find(car => car.id === id || car.creator === id);
  }
);

