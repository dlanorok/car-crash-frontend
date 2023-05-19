import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { CarModel } from "../../../shared/models/car.model";
import { forkJoin, map, of, skip, Subscription, switchMap, take, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormGroup } from "@angular/forms";
import { catchError } from "rxjs/operators";
import { PolicyHolderModel } from "../../../shared/models/policy-holder.model";
import { PolicyHoldersApiService } from "../../../shared/api/policy-holders/policy-holders-api.service";
import { PolicyHolderFormComponent } from "../../../shared/components/forms/policy-holder-form/policy-holder-form.component";
import { InsurancesApiService } from "../../../shared/api/insurances/insurances-api.service";
import { InsuranceModel } from "../../../shared/models/insurance.model";
import { InsuranceFormComponent } from "../../../shared/components/forms/insurance-form/insurance-form.component";
import { DriverFormComponent } from "../../../shared/components/forms/driver-form/driver-form.component";
import { DriverModel } from "../../../shared/models/driver.model";
import { DriversApiService } from "../../../shared/api/drivers/drivers-api.service";
import { BaseFormComponent } from "../../../shared/components/forms/base-form.component";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  policyHolder?: PolicyHolderModel
  car?: CarModel;
  insurance?: InsuranceModel;
  driver?: DriverModel;

  form!: UntypedFormGroup;
  step: number = 1;

  @ViewChild('policyHolderForm', { static: false }) protected policyHolderForm?: PolicyHolderFormComponent;

  @ViewChild('policyHolderForm')
  set setPolicyHolderForm(policyHolderForm: PolicyHolderFormComponent) {
    if(policyHolderForm) {
      this.setFormsData();
      this.subscribeToFormChange(policyHolderForm)
    }
  }

  @ViewChild('insuranceForm', { static: false }) protected insuranceForm?: InsuranceFormComponent;

  @ViewChild('insuranceForm')
  set setInsuranceForm(insuranceForm: InsuranceFormComponent) {
    if(insuranceForm) {
      this.setFormsData();
      this.subscribeToFormChange(insuranceForm)
    }
  }

  @ViewChild('driverForm', { static: false }) protected driverForm?: DriverFormComponent;

  @ViewChild('driverForm')
  set setDriverForm(driverForm: DriverFormComponent) {
    if(driverForm) {
      this.setFormsData();
      this.subscribeToFormChange(driverForm)
    }
  }

  private formChangeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly policyHoldersApiService: PolicyHoldersApiService,
    private readonly carsApiService: CarsApiService,
    private readonly insurancesApiService: InsurancesApiService,
    private readonly driversApiService: DriversApiService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  get stepTitle(): string {
    switch (this.step) {
      case 1:
        return 'car-crash.home.car.policy-holder';
      case 2:
        return 'car-crash.home.car.insurance';
      case 3:
        return 'car-crash.home.car.driver';
    }
    return '';
  }

  private subscribeToFormChange(baseForm: BaseFormComponent<any>) {
    this.formChangeSubscription?.unsubscribe();
    this.formChangeSubscription = baseForm.formChange
      .pipe(
        tap(() => {
          this.saveForm(baseForm)
        })
      ).subscribe()
  }

  private setFormsData() {
    if (this.policyHolderForm && this.policyHolder) {
      this.policyHolderForm.setDefaults(this.policyHolder);
    } else if (this.insuranceForm && this.insurance) {
      this.insuranceForm.setDefaults(this.insurance);
    } else if (this.driverForm && this.driver) {
      this.driverForm.setDefaults(this.driver);
    }
  }

  private getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }

          return forkJoin([
            this.carsApiService.getSingle(carId),
            this.policyHoldersApiService.getSingle(carId).pipe(catchError(() => {
              this.policyHolder = new PolicyHolderModel({car: carId});
              return of(this.policyHolder);
            })),
            this.insurancesApiService.getSingle(carId).pipe(catchError(() => {
              this.insurance = new InsuranceModel({car: carId});
              return of(this.insurance);
            })),
            this.driversApiService.getSingle(carId).pipe(catchError(() => {
              this.driver = new DriverModel({car: carId});
              return of(this.driver);
            })),
          ])
            .pipe(
              tap(([car, policyHolder, insurance, driver]: [CarModel, PolicyHolderModel, InsuranceModel, DriverModel]) => {
                this.car = car;
                this.policyHolder = policyHolder;
                this.insurance = insurance;
                this.driver = driver;
                this.setFormsData();
              })
            )
        }),
      )
      .subscribe()
  }

  submitForm() {
    this.saveForm(this.policyHolderForm || this.driverForm || this.insuranceForm);
    this.step++;
  }

  private saveForm(baseForm: BaseFormComponent<any> | undefined) {
    if (!baseForm) {
      return
    }

    if (baseForm instanceof PolicyHolderFormComponent) {
      this.policyHolder = new PolicyHolderModel({
        ...this.policyHolder,
        ...baseForm.form.value
      })
      this.policyHoldersApiService.create(this.policyHolder).pipe(take(1)).subscribe();
    } else if (baseForm instanceof InsuranceFormComponent) {
      this.insurance = new InsuranceModel({
        ...this.insurance,
        ...baseForm.form.value
      })
      this.insurancesApiService.create(this.insurance).pipe(take(1)).subscribe();
    } else if (baseForm instanceof DriverFormComponent) {
      this.driver = new DriverModel({
        ...this.driver,
        ...baseForm.form.value
      })
      this.driversApiService.create(this.driver).pipe(take(1)).subscribe();
    }
  }

  readonly onHeadBackClick: () => void = () => {
    this.step--;
  }

}
