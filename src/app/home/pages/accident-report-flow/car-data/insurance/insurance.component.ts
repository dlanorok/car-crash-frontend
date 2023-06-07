import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, of, switchMap, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { TranslocoService } from "@ngneat/transloco";
import { HeaderService } from "@app/shared/services/header-service";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { loadCars, updateCarSubModel } from "@app/app-state/car/car-action";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { InsuranceFormComponent } from "@app/shared/components/forms/insurance-form/insurance-form.component";
import { InsuranceModel } from "@app/shared/models/insurance.model";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent extends BaseFlowComponent<InsuranceFormComponent, InsuranceModel> implements OnInit {
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  constructor(
    protected readonly router: Router,
    protected readonly translateService: TranslocoService,
    private readonly headerService: HeaderService,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly cookieService: CookieService
  ) {
    super(router, translateService);
  }

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Insurance company', preventBack: true});
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
  }

  setFormsData() {
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

                this.baseModel = car.insurance || new InsuranceModel({car: car.id});

                if (initial) {
                  this.formComponent?.setDefaults(this.baseModel);
                  initial = false;
                }
              })
            );
        })
      ).subscribe();
  }

  protected saveForm(insurance: InsuranceModel, validate = false) {
    insurance = Object.assign(new InsuranceModel({car: this.baseModel.car}), insurance);
    insurance.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: insurance.car,
        model: insurance
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/driver`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/policy-holder`]);
  }
}
