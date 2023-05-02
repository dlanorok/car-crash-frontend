import { Component, OnInit } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { ActivatedRoute } from "@angular/router";
import { Car } from "../../../shared/models/car.model";
import { map, of, switchMap, tap } from "rxjs";
import { Crash } from "../../../shared/models/crash.model";
import { CrashesApiService } from "../../../shared/api/crashes/crashes-api.service";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash?: Crash;
  private crashId?: string;

  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly crashesApiService: CrashesApiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getData();
  }


  createCar() {
    if (!this.crashId) {
      throw new Error("Crash id missing, please restart the flow.")
    }

    this.carsApiService.create(new Car({crash: this.crashId})).subscribe();
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('crashId')),
        switchMap((crashId: string | null) => {
          if (crashId) {
            this.crashId = crashId;
            return this.crashesApiService.getSingle(crashId);
          }

          return of(undefined);
        }),
      )
      .subscribe()
  }
}
