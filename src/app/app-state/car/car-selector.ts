import { CarState } from "./car-reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const featureKey = 'carStore';

export const selectCarState = createFeatureSelector<CarState>(featureKey);
export const selectCars = createSelector(
  selectCarState,
  (state: CarState) => state.cars
);
