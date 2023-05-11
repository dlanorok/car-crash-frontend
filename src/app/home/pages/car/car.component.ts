import { Component, OnInit } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { CarModel } from "../../../shared/models/car.model";
import { debounceTime, distinctUntilChanged, EMPTY, finalize, map, mergeMap, of, switchMap, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { PolicyHolderModel } from "../../../shared/models/policy-holder.model";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  car?: CarModel
  form!: UntypedFormGroup;

  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }
          return this.carsApiService.getSingle(carId)
            .pipe(
              tap((car: CarModel) => this.car = car),
              catchError(() => {
                this.car = new CarModel({car: carId});
                return EMPTY;
              }),
              finalize(() => this.setForm())
            );
        }),
      )
      .subscribe()
  }

  private setForm(): void {
    this.form = this.formBuilder.group(
      {
        registration_plate: [this.car?.registration_plate],
        make_type: [this.car?.make_type],
      }
    )
    this.subscribeToFormChange()
  }

  private subscribeToFormChange() {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap(() => this.saveCar())
      ).subscribe()
  }

  private saveCar() {
    const car = new CarModel({
        ...this.car,
        ...this.form.value,
      }
    )

    return car.id
      ? this.carsApiService.put(car)
      : this.carsApiService.create(car)
  }

  submitForm() {
    this.saveCar()
      .pipe(
        tap(() => {
          this.router.navigate(
            [this.router.url.replace(/\/cars\/\d+/, '')]
          )
        })
      ).subscribe()
  }

}
