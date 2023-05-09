import { Component, OnInit } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { ActivatedRoute } from "@angular/router";
import { Car } from "../../../shared/models/car.model";
import { first, map, mergeMap, Observable, switchMap, take, tap } from "rxjs";
import { Crash } from "../../../shared/models/crash.model";
import { CrashesApiService } from "../../../shared/api/crashes/crashes-api.service";
import { Store } from "@ngrx/store";
import { addCar, loadCrash } from "../../../app-state/crash/crash-action";
import { selectCrash } from "../../../app-state/crash/crash-selector";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash$: Observable<(Crash | undefined)> = this.store.select(selectCrash);
  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly crashesApiService: CrashesApiService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.getData();
  }


  createCar() {
    this.crash$
      .pipe(
        take(1),
        switchMap((crash: Crash | undefined) => {
          if (!crash) {
            throw new Error("Crash undefined");
          }
          return this.carsApiService.create(new Car({crash: crash.id}));
        }),
        tap((car: Car) => {
          this.store.dispatch(addCar({ carId: car.id }))
        })
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
