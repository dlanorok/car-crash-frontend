import { Component, OnInit, ViewChild } from "@angular/core";
import { CarModel } from "@app/shared/models/car.model";
import { PolicyHolderModel } from "@app/shared/models/policy-holder.model";
import { InsuranceModel } from "@app/shared/models/insurance.model";
import { DriverModel } from "@app/shared/models/driver.model";
import { BaseFormComponent } from "@app/shared/components/forms/base-form.component";
import { Step } from "@app/shared/common/stepper-data";
import { PolicyHolderFormComponent } from "@app/shared/components/forms/policy-holder-form/policy-holder-form.component";
import { InsuranceFormComponent } from "@app/shared/components/forms/insurance-form/insurance-form.component";
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import { filter, Observable, of, Subscription, switchMap, take, tap } from "rxjs";
import { selectCars } from "@app/app-state/car/car-selector";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { PolicyHoldersApiService } from "@app/shared/api/policy-holders/policy-holders-api.service";
import { CarsApiService } from "@app/shared/api/cars/cars-api.service";
import { InsurancesApiService } from "@app/shared/api/insurances/insurances-api.service";
import { DriversApiService } from "@app/shared/api/drivers/drivers-api.service";
import { CircumstancesApiService } from "@app/shared/api/circumstances/circumstances-api.service";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { TranslocoService } from "@ngneat/transloco";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { map } from "rxjs/operators";
import { loadCars, updateCarSubModel } from "@app/app-state/car/car-action";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { BaseApiService } from "@app/shared/api/base-api.service";
import { BaseModel } from "@app/shared/models/base.model";
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

  car!: CarModel;
  policyHolder?: PolicyHolderModel;
  insurance?: InsuranceModel;
  driver?: DriverModel;

  baseFormComponent!: BaseFormComponent<any>;
  step = 1;
  showOCRComponent = false;

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
  ];

  @ViewChild('policyHolderForm', {static: false}) protected policyHolderForm?: PolicyHolderFormComponent;

  @ViewChild('policyHolderForm')
  set setPolicyHolderForm(policyHolderForm: PolicyHolderFormComponent) {
    if (policyHolderForm) {
      this.baseFormComponent = policyHolderForm;
      this.setFormsData();
      this.subscribeToFormChange(policyHolderForm);
    }
  }

  @ViewChild('insuranceForm', {static: false}) protected insuranceForm?: InsuranceFormComponent;

  @ViewChild('insuranceForm')
  set setInsuranceForm(insuranceForm: InsuranceFormComponent) {
    if (insuranceForm) {
      this.baseFormComponent = insuranceForm;
      this.setFormsData();
      this.subscribeToFormChange(insuranceForm);
    }
  }

  @ViewChild('driverForm', {static: false}) protected driverForm?: DriverFormComponent;

  @ViewChild('driverForm')
  set setDriverForm(driverForm: DriverFormComponent) {
    if (driverForm) {
      this.baseFormComponent = driverForm;
      this.setFormsData();
      this.subscribeToFormChange(driverForm);
    }
  }

  cars$: Observable<CarModel[]> = this.store.select(selectCars);
  crash$: Observable<CarModel[]> = this.store.select(selectCars);

  private formChangeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly policyHoldersApiService: PolicyHoldersApiService,
    private readonly carsApiService: CarsApiService,
    private readonly insurancesApiService: InsurancesApiService,
    private readonly driversApiService: DriversApiService,
    private readonly circumstancesApiService: CircumstancesApiService,
    private readonly router: Router,
    private readonly pageDataService: PageDataService,
    private readonly store: Store,
    private readonly cookieService: CookieService,
    private readonly translateService: TranslocoService
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.getStepFromRoute();
    this.pageDataService.pageData = {pageName: '§§Your data'};
  }

  processOCRResponse(response: Response) {
    this.baseFormComponent.setFromOCRResponse(response);
    this.showOCRComponent = false;
  }

  private subscribeToFormChange<T>(baseForm: BaseFormComponent<T>) {
    this.formChangeSubscription?.unsubscribe();
    this.formChangeSubscription = baseForm.formChange
      .pipe(
        tap(() => {
          this.saveForm(baseForm);
        })
      ).subscribe();
  }

  private setFormsData() {
    if (!this.baseFormComponent) {
      return;
    }

    if (this.step === 1) {
      this.baseFormComponent.setDefaults(this.policyHolder);
    } else if (this.step === 2) {
      this.baseFormComponent.setDefaults(this.insurance);
    } else if (this.step === 3) {
      this.baseFormComponent.setDefaults(this.driver);
    }
  }

  private getStepFromRoute(): void {
    this.route.queryParamMap
      .pipe(
        tap((params: ParamMap) => {
          this.step = parseInt(params.get('step') ?? '1');
        })
      ).subscribe();
  }

  private getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }
          this.store.dispatch(loadCars());

          let initial = true;

          return this.cars$
            .pipe(
              filter((cars: CarModel[]) => cars.length > 0),
              tap((cars: CarModel[]) => {
                const car = cars.find(_car => _car.id.toString() === carId || _car.creator === this.cookieService.get(CookieName.sessionId));
                if (!car) {
                  return;
                }

                this.car = car;
                this.policyHolder = car.policy_holder || new PolicyHolderModel({car: car.id});
                this.insurance = car.insurance || new InsuranceModel({car: car.id});
                this.driver = car.driver || new DriverModel({car: car.id});

                if (initial) {
                  this.setFormsData();
                  initial = false;
                }
              })
            );
        }),
      )
      .subscribe();
  }

  setStep(next: boolean): void {
    if (next) {
      this.step++;
    } else {
      this.step--;
    }

    this.router.navigate([], {
      queryParams: {
        step: this.step,
      },
      queryParamsHandling: 'merge',
    });
  }

  back() {
    if (this.step === 1) {
      this.navigateToCrash();
    } else {
      this.setStep(false);
    }
  }

  nextStep() {
    const form = this.policyHolderForm || this.driverForm || this.insuranceForm;
    if (form) {
      form.submitForm();
      if (form.isFormValid()) {
        this.saveForm(this.policyHolderForm || this.driverForm || this.insuranceForm, true);
        this.navigateToNextView();
      }
    } else {
      this.navigateToNextView();
    }
  }

  private navigateToNextView() {
    if (this.step === this.steps.length) {
      this.navigateToCrash();
    } else {
      this.setStep(true);
    }
  }

  private saveForm<T>(baseForm: BaseFormComponent<T> | undefined, validate = false) {
    if (!baseForm) {
      return;
    }

    let apiService: BaseApiService<any> | undefined = undefined;
    let model: BaseModel | undefined = undefined;

    if (baseForm instanceof PolicyHolderFormComponent) {
      this.policyHolder = new PolicyHolderModel({
        ...this.policyHolder,
        ...baseForm.form.value
      });
      apiService = this.policyHoldersApiService;
      model = this.policyHolder;
    } else if (baseForm instanceof InsuranceFormComponent) {
      this.insurance = new InsuranceModel({
        ...this.insurance,
        ...baseForm.form.value
      });
      apiService = this.insurancesApiService;
      model = this.insurance;
    } else if (baseForm instanceof DriverFormComponent) {
      this.driver = new DriverModel({
        ...this.driver,
        ...baseForm.form.value
      });
      apiService = this.driversApiService;
      model = this.driver;
    }

    if (!model || !apiService) {
      return;
    }

    model.validate = validate;

    apiService.create(model).pipe(
      take(1),
      tap((baseModel: BaseModel) => this.store.dispatch(
        updateCarSubModel({
          carId: baseModel.id,
          model: baseModel
        }))
      )
    ).subscribe();
  }

  private navigateToCrash() {
    this.router.navigate([this.router.url.replace(/\/cars\/.*/, '')]);
  }

}
