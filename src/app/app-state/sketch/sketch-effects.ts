import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, withLatestFrom } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { loadSketches, loadSketchesSuccessful } from "./sketch-action";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CarsApiService } from "../../shared/api/cars/cars-api.service";
import { selectSketches } from "./sketch-selector";
import { SketchesApiService } from "@app/shared/api/sketches/sketches-api.service";
import { SketchModel } from "@app/shared/models/sketch.model";

@Injectable()
export class SketchEffects {

  loadSketches$ = createEffect(() => this.actions$.pipe(
      ofType(loadSketches),
      withLatestFrom(this.store.select(selectSketches)),
      exhaustMap(([action, sketches]) => this.sketchesApiService.getList()
        .pipe(
          map((sketches: SketchModel[]) => {
            return ({type: loadSketchesSuccessful.type, sketches});
          }),
          catchError(() => {
            return EMPTY;
          })
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private sketchesApiService: SketchesApiService,
    private carsApiService: CarsApiService,
    private router: Router,
    private store: Store,

  ) {
  }
}
