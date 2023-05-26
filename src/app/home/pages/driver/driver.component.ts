import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EMPTY, finalize, map, mergeMap, tap } from "rxjs";
import { catchError } from "rxjs/operators";
import { DriversApiService } from "../../../shared/api/drivers/drivers-api.service";
import { DriverModel } from "../../../shared/models/driver.model";
import { DriverFormComponent } from "../../../shared/components/forms/driver-form/driver-form.component";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit, AfterViewInit {
  @ViewChild('driverForm', { static: false }) protected driverForm?: DriverFormComponent;

  driver?: DriverModel;

  constructor(
    private readonly driversApiService: DriversApiService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.getDataFromRoute();
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
              finalize(() => {
                if (!this.driver) {
                  return;
                }

                this.driverForm?.setDefaults(this.driver);
              })
            );
        }),
      ).subscribe();
  }

  ngAfterViewInit(): void {
    this.subscribeAfterFormSubmit();
  }

  submitForm() {
    this.driverForm?.submitForm();
  }

  private subscribeAfterFormSubmit() {
    this.driverForm?.formSubmit
      .pipe(
        mergeMap((model: DriverModel) => {
          this.driver = {
            ...this.driver,
            ...model
          };
          return this.driversApiService.create(this.driver);
        }),
        tap(() => {
          this.router.navigate(
            [this.router.url.replace(/\/cars\/\d+\/driver$/, '')]
          );
        })
      ).subscribe();
  }
}
