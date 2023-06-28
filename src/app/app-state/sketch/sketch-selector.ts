import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SketchState } from "@app/app-state/sketch/sketch-reducer";

export const featureKey = 'sketchStore';

export const selectSketchState = createFeatureSelector<SketchState>(featureKey);

export const selectSketches = createSelector(
  selectSketchState,
  (state: SketchState) => state.sketches
);
