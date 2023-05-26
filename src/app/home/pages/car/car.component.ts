import { Component, OnInit, ViewChild } from '@angular/core';
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";
import { CarModel } from "../../../shared/models/car.model";
import { forkJoin, map, of, Subscription, switchMap, take, tap } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
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
import { Step } from "../../../shared/common/stepper-data";
import { CircumstanceFormComponent } from "../../../shared/components/forms/circumstance-form/circumstance-form.component";
import { CircumstanceModel } from "../../../shared/models/circumstance.model";
import { CircumstancesApiService } from "../../../shared/api/circumstances/circumstances-api.service";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  carCrashSvg = require('src/assets/icons/car-crash.svg');

  car!: CarModel;
  policyHolder?: PolicyHolderModel
  insurance?: InsuranceModel;
  driver?: DriverModel;
  circumstance?: CircumstanceModel;

  form!: UntypedFormGroup;
  step: number = 1;
  innerStep: number = 1;

  steps: Step[] = [
    {
      name: 'car-crash.car.policy-holder',
      icon: 'bi-file-earmark-person'
    },
    {
      name: 'car-crash.car.insurance',
      icon: 'bi-shield-check'
    },
    {
      name: 'car-crash.car.driver',
      icon: 'bi-person-vcard'
    },
    {
      name: 'car-crash.car.circumstances',
      icon: 'bi-file-earmark-bar-graph'
    },
    {
      name: 'car-crash.car.crash-section',
      svg: this.carCrashSvg,
      innerStepsLength: 3
    }
  ]

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

  @ViewChild('circumstanceForm', { static: false }) protected circumstanceForm?: CircumstanceFormComponent;

  @ViewChild('circumstanceForm')
  set setCircumstanceForm(circumstanceForm: CircumstanceFormComponent) {
    if(circumstanceForm) {
      this.setFormsData();
      this.subscribeToFormChange(circumstanceForm)
    }
  }

  private formChangeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly policyHoldersApiService: PolicyHoldersApiService,
    private readonly carsApiService: CarsApiService,
    private readonly insurancesApiService: InsurancesApiService,
    private readonly driversApiService: DriversApiService,
    private readonly circumstancesApiService: CircumstancesApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getStepFromRoute();
  }

  get isLastStep(): boolean {
    return this.step === this.steps.length && this.steps[this.step - 1].innerStepsLength === this.innerStep;
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
    } else if (this.circumstanceForm && this.circumstance) {
      this.circumstanceForm.setDefaults(this.circumstance);
    }
  }

  private getStepFromRoute(): void {
    this.route.queryParamMap
      .pipe(
        tap((params: ParamMap) => {
          this.step = parseInt(params.get('step') ?? '1');
        })
      ).subscribe()
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
            this.circumstancesApiService.getSingle(carId).pipe(catchError(() => {
              this.circumstance = new CircumstanceModel({car: carId});
              return of(this.circumstance);
            })),
          ])
            .pipe(
              tap((
                [car, policyHolder, insurance, driver, circumstance]:
                  [CarModel, PolicyHolderModel, InsuranceModel, DriverModel, CircumstanceModel]
              ) => {
                this.car = car;
                this.policyHolder = policyHolder;
                this.insurance = insurance;
                this.driver = driver;
                this.circumstance = circumstance;
                this.setFormsData();
              })
            )
        }),
      )
      .subscribe()
  }

  setStep(next: boolean): void {
    let innerSteps = this.steps[this.step - 1].innerStepsLength || 1;
    if (next) {
      if (innerSteps === this.innerStep) {
        this.innerStep = 1;
        this.step++;
      } else {
        this.innerStep++;
      }
    } else {
      if (this.innerStep === 1) {
        this.innerStep = 1;
        this.step --;
      } else {
        this.innerStep--;
      }
    }

    this.router.navigate([], {
      queryParams: {
        step: this.step,
        innerStep: this.innerStep
      },
      queryParamsHandling: 'merge',
    });
  }

  back() {
    if (this.step === 1) {
      this.navigateToCrash()
    } else {
      this.setStep(false);
    }
  }

  nextStep() {
    const form = this.policyHolderForm || this.driverForm || this.insuranceForm || this.circumstanceForm;
    if (form) {
      form.submitForm();
      if (form.isFormValid()) {
        this.saveForm(this.policyHolderForm || this.driverForm || this.insuranceForm);
        this.navigateToNextView();
      }
    } else {
      this.navigateToNextView();
    }
  }

  private navigateToNextView() {
    if (this.isLastStep) {
      this.navigateToCrash()
    } else {
      this.setStep(true);
    }
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
    } else if (baseForm instanceof CircumstanceFormComponent) {
      this.circumstance = new CircumstanceModel({
        ...this.circumstance,
        ...baseForm.form.value
      })
      this.circumstancesApiService.create(this.circumstance).pipe(take(1)).subscribe();
    }
  }

  private navigateToCrash() {
    this.router.navigate([this.router.url.replace(/\/cars\/.*/, '')])
  }

}
