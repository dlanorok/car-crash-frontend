import { createAction, props } from '@ngrx/store';
import { PolygonsData, SketchCarModel, SketchModel } from "@app/shared/models/sketch.model";

export const loadSketches = createAction(
  '[AccidentSketch Component]  Load Sketch'
);

export const createSketchSuccessful = createAction(
  '[AccidentSketch Api] Create Sketch Successful',
  props<{sketch: SketchModel}>()
);

export const loadSketchesSuccessful = createAction(
  '[AccidentSketch Api] Create Sketch Successful',
  props<{sketches: SketchModel[]}>()
);

export const wsSketchCarUpdated = createAction(
  '[WS Service] Google Map Car updated',
  props<{sketchCar: SketchCarModel}>()
);

export const wsSketchPolygonsUpdated = createAction(
  '[WS Service] Google Map Polygons updated',
  props<{polygonData: PolygonsData}>()
);

export const wsSketchUpdated = createAction(
  '[WS Service] Sketch updated',
  props<{sketch: SketchModel}>()
);
