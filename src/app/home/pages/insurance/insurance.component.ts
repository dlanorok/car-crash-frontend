import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InsuranceFormComponent } from "../../../shared/components/forms/insurance-form/insurance-form.component";
import { EMPTY, finalize, map, mergeMap, tap } from "rxjs";
import { InsuranceModel } from "../../../shared/models/insurance.model";
import { InsurancesApiService } from "../../../shared/api/insurances/insurances-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements AfterViewInit, OnInit {
  @ViewChild('insuranceForm', { static: false }) protected insuranceForm?: InsuranceFormComponent;

  insurance?: InsuranceModel;

  constructor(
    private readonly insurancesApiAService: InsurancesApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params)=> {
          return params['carId'];
        }),
        mergeMap((carId: string) => {
          return this.insurancesApiAService.getSingle(carId)
            .pipe(
              tap((insurance: InsuranceModel) => {
                this.insurance = insurance;
              }),
              catchError(() => {
                this.insurance = new InsuranceModel({car: carId});
                return EMPTY;
              }),
              finalize(() => {
                if (!this.insurance) {
                  return
                }
                this.insuranceForm?.setDefaults(this.insurance);
              })
            );
        }),
      ).subscribe()
  }

  ngAfterViewInit(): void {
    this.subscribeAfterFormSubmit()
  }

  submitForm() {
    this.insuranceForm?.submitForm();
  }

  private subscribeAfterFormSubmit() {
    this.insuranceForm?.formSubmit
      .pipe(
        mergeMap((model: InsuranceModel) => {
          this.insurance = {
            ...this.insurance,
            ...model
          }
          return this.insurancesApiAService.create(this.insurance);
        }),
        tap(() => {
          this.router.navigate(
            [this.router.url.replace(/\/cars\/\d+\/insurance-company$/, '')]
          )
        })
      ).subscribe()
  }
}
