import { Component } from '@angular/core';
import { CrashesApiService } from "../../../shared/api/crashes/crashes-api.service";
import { mergeMap, take, tap } from "rxjs";
import { Crash } from "../../../shared/models/crash.model";
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { Car } from "../../../shared/models/car.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-crash',
  templateUrl: './create-crash.component.html',
  styleUrls: ['./create-crash.component.scss']
})
export class CreateCrashComponent {

  constructor(
    private readonly crashesApiService: CrashesApiService,
    private readonly carApiService: CarsApiService,
    private readonly routerService: Router
  ) {}

  createCrash() {
    this.crashesApiService.create(new Crash())
      .pipe(
        mergeMap((crash: Crash) => {
          return this.carApiService.create(new Car({ crash: crash.id }))
            .pipe(
              tap((car: Car) => {
                this.routerService.navigate([`/crash/${crash.session_id}/cars/${car.id}`])
              })
            )
        }),
        take(1)
      ).subscribe();
  }
}
