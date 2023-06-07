import { Component, OnInit } from '@angular/core';
import { filter, Observable, of, switchMap, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { TranslocoService } from "@ngneat/transloco";
import { HeaderService } from "@app/shared/services/header-service";
import { Store } from "@ngrx/store";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { PolicyHolderFormComponent } from "@app/shared/components/forms/policy-holder-form/policy-holder-form.component";
import { PolicyHolderModel } from "@app/shared/models/policy-holder.model";
import { loadCars, updateCarSubModel } from "@app/app-state/car/car-action";
import { selectCars } from "@app/app-state/car/car-selector";
import { CarModel } from "@app/shared/models/car.model";
import { map } from "rxjs/operators";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-policy-holder',
  templateUrl: './policy-holder.component.html',
  styleUrls: ['./policy-holder.component.scss']
})
export class PolicyHolderComponent extends BaseFlowComponent<PolicyHolderFormComponent, PolicyHolderModel> implements OnInit {
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
    this.headerService.setHeaderData({name: '§§Policy holder', preventBack: true});
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

                this.baseModel = car.policy_holder || new PolicyHolderModel({car: car.id});

                if (initial) {
                  this.formComponent?.setDefaults(this.baseModel);
                  initial = false;
                }
              })
            );
        })
      ).subscribe();
  }

  protected saveForm(policyHolder: PolicyHolderModel, validate = false) {
    policyHolder = Object.assign(new PolicyHolderModel({car: this.baseModel.car}), policyHolder);
    policyHolder.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: policyHolder.car,
        model: policyHolder
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/insurance-company`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}`]);
  }
}
