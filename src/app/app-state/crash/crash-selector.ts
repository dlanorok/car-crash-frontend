import { CrashState } from "./crash-reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const featureKey = 'crash';

export const selectCrashState = createFeatureSelector<CrashState>(featureKey);
export const selectCrash = createSelector(
  selectCrashState,
  (state: CrashState) => state.crash
);
