import { CrashState } from "./crash-reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const featureKey = 'crashStore';

export const selectCrashState = createFeatureSelector<CrashState>(featureKey);

export const selectCrash = createSelector(
  selectCrashState,
  (state: CrashState) => state.crash
);
