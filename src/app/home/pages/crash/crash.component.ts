import { Component, OnInit } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CarModel } from "../../../shared/models/car.model";
import { first, map, mergeMap, Observable, switchMap, take, tap } from "rxjs";
import { Crash } from "../../../shared/models/crash.model";
import { CrashesApiService } from "../../../shared/api/crashes/crashes-api.service";
import { Store } from "@ngrx/store";
import { addCar, loadCrash } from "../../../app-state/crash/crash-action";
import { selectCrash } from "../../../app-state/crash/crash-selector";
import { selectCars } from "../../../app-state/car/car-selector";
import { createCar } from "../../../app-state/car/car-action";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash$: Observable<(Crash | undefined)> = this.store.select(selectCrash);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly crashesApiService: CrashesApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.getData();
  }


  createCar() {
    this.crash$
      .pipe(
        take(1),
        tap((crash: Crash | undefined) => {
          if (!crash) {
            throw new Error("Crash undefined");
          }
          this.store.dispatch(createCar({crashSessionId: crash?.id}))
        }),
      ).subscribe()
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('sessionId')),
        tap((sessionId: string | null) => {
          if (sessionId) {
            this.store.dispatch(loadCrash({sessionId: sessionId}));
          }
        }),
      )
      .subscribe()
  }
}
