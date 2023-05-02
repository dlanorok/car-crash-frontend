import { Component, OnInit } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { Car } from "../../../shared/models/car.model";
import { map, of, switchMap, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  car?: Car
  carId?: number;

  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }
          return this.carsApiService.getSingle(carId)
            .pipe(
              tap((car: Car) => this.car = car)
            );
        }),
      )
      .subscribe()
  }

}
