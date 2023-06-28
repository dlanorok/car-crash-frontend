import { createReducer, on } from '@ngrx/store';
import { SketchModel } from "@app/shared/models/sketch.model";
import {
  createSketchSuccessful,
  loadSketchesSuccessful, wsSketchCarUpdated, wsSketchPolygonsUpdated, wsSketchUpdated,
} from "@app/app-state/sketch/sketch-action";

export interface SketchState {
  sketches: SketchModel[]
  isLoading: boolean
}

export const initialState: SketchState = {
  sketches: [],
  isLoading: false
};

export const sketchReducer = createReducer(
  initialState,
  on(createSketchSuccessful, (state, {sketch}) => {
    return {
      ...state,
      sketches: [...state.sketches, sketch]
    };
  }),
  on(loadSketchesSuccessful, (state, {sketches}) => {
    return {
      ...state,
      sketches: [...sketches]
    };
  }),
  on(wsSketchCarUpdated, (state, {sketchCar}) => {
    return {
      ...state,
      sketches: [
        ...state.sketches.map((sketch) => {
          if (sketch.id === sketchCar.sketch) {
            const newSketch = new SketchModel({...sketch});
            newSketch.sketch_cars = sketch.sketch_cars.map((sketch_car) => {
              if (sketch_car.car_id === sketchCar.car_id) {
                return sketchCar;
              }
              return sketch_car;
            });
            return newSketch;
          }
          return sketch;
        })
      ]
    };
  }),
  on(wsSketchPolygonsUpdated, (state, {polygonData}) => {
    return {
      ...state,
      sketches: [
        ...state.sketches.map((sketch) => {
          if (sketch.id === polygonData.sketch_id) {
            const newSketch = new SketchModel({...sketch});
            newSketch.polygons = JSON.stringify(polygonData);
            return newSketch;
          }
          return sketch;
        })
      ]
    };
  }),
  on(wsSketchUpdated, (state, {sketch}) => {
    return {
      ...state,
      sketches: [
        ...state.sketches.map((_sketch) => {
          if (_sketch.id === sketch.id) {
            return sketch;
          }
          return _sketch;
        })
      ]
    };
  }),
);
