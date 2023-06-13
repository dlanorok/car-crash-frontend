import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { BaseFormComponent } from "@app/shared/components/forms/base-form.component";
import { filter, map, Observable, of, Subscription, switchMap, tap } from "rxjs";
import { BaseModel } from "@app/shared/models/base.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { CookieService } from "ngx-cookie-service";
import { CarModel } from "@app/shared/models/car.model";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { loadCars } from "@app/app-state/car/car-action";
import { Store } from "@ngrx/store";
import { selectCars } from "@app/app-state/car/car-selector";
import { StorageItem } from "@app/shared/common/enumerators/storage";

@Component({
  template: '',
})
export abstract class BaseFlowComponent<T, C extends BaseModel> extends BaseFooterComponent implements OnInit {
  protected readonly router: Router = inject(Router);
  protected readonly translateService: TranslocoService = inject(TranslocoService);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly store: Store = inject(Store);

  cars$: Observable<CarModel[]> = this.store.select(selectCars);
  car?: CarModel;

  @ViewChild('formComponent', {static: false}) protected formComponent?: BaseFormComponent<C>;

  @ViewChild('formComponent')
  set setCircumstanceForm(formComponent: BaseFormComponent<T>) {
    if (formComponent) {
      this.setFormsData();
      this.disableFormCheck();
      this.subscribeToFormChange();
      this.subscribeAfterFormSubmit();
    }
  }

  formChangeSubscription?: Subscription;
  baseModel!: C;
  showOCRComponent = false;

  protected abstract setFormsData(): void;
  protected abstract saveForm(model: C, validate: boolean): void;

  ngOnInit(): void {
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }

    this.store.dispatch(loadCars());
    this.getDataFromParams();
  }

  protected disableFormCheck() {
    if (this.car && this.car.creator !== this.cookieService.get(CookieName.sessionId)) {
      this.formComponent?.form.disable();
    }
  }

  private getDataFromParams() {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }

          let initial = true;

          return this.cars$
            .pipe(
              filter((cars: CarModel[]) => cars.length > 0),
              tap((cars: CarModel[]) => {
                const car = cars.find(_car => _car.id.toString() === carId);
                if (!car) {
                  return;
                }
                this.car = car;

                if (initial) {
                  this.setFormsData();
                  this.disableFormCheck();
                  initial = false;
                }
              })
            );
        })
      ).subscribe();
  }

  private subscribeToFormChange(): void {
    this.formChangeSubscription?.unsubscribe();
    this.formChangeSubscription = this.formComponent?.formChange
      .pipe(
        tap((model: C) => {
          this.saveForm(model, false);
        })
      ).subscribe();
  }

  private subscribeAfterFormSubmit(): void {
    this.formComponent?.formSubmit
      .pipe(
        tap((model: C) => {
          this.saveForm(model, true);
        })
      ).subscribe();
  }

  next(): void {
    this.submit();
  }

  submit(): void {
    this.formComponent?.submitForm();
  }

  processOCRResponse(response: Response) {
    this.formComponent?.setFromOCRResponse(response);
    this.showOCRComponent = false;
  }

}
