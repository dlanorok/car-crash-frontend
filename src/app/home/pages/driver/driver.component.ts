import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, EMPTY, finalize, map, mergeMap, Observable, tap } from "rxjs";
import { catchError } from "rxjs/operators";
import { DriversApiService } from "../../../shared/api/drivers/drivers-api.service";
import { DriverModel } from "../../../shared/models/driver.model";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit{
  driver?: DriverModel;
  form!: UntypedFormGroup;

  constructor(
    private readonly driversApiService: DriversApiService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.getDataFromRoute()
  }

  private getDataFromRoute(): void {
    this.route.params
      .pipe(
        map((params)=> {
          return params['carId'];
        }),
        mergeMap((carId: string) => {
          return this.driversApiService.getSingle(carId)
            .pipe(
              tap((driver: DriverModel) => {
                this.driver = driver;
              }),
              catchError(() => {
                this.driver = new DriverModel({car: carId});
                return EMPTY;
              }),
              finalize(() => this.setForm())
            );
        }),
      ).subscribe()
  }

  private setForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [this.driver?.name],
        surname: [this.driver?.surname],
        address: [this.driver?.address],
        driving_licence_number: [this.driver?.driving_licence_number],
        driving_licence_valid_to: [this.driver?.driving_licence_valid_to],
      }
    )
    this.subscribeToFormChange()
  }

  private subscribeToFormChange() {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap(() => this.saveDriver())
      ).subscribe()
  }

  private saveDriver(): Observable<DriverModel> {
    const driver = new DriverModel({
        ...this.driver,
        ...this.form.value,
      }
    )

    return this.driversApiService.create(driver);
  }

  submitForm() {
    this.saveDriver()
      .pipe(
        tap(() => {
          this.router.navigate(
            [this.router.url.replace(/\/cars\/\d+\/driver$/, '')]
          )
        })
      ).subscribe()
  }
}
