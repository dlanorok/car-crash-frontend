import { Component, OnInit } from '@angular/core';
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { HeaderService } from "@app/shared/services/header-service";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { filter, map, Observable, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { CircumstanceFormComponent } from "@app/shared/components/forms/circumstance-form/circumstance-form.component";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { CookieService } from "ngx-cookie-service";
import { loadCars, updateCarSubModel } from "@app/app-state/car/car-action";
import { CookieName } from "@app/shared/common/enumerators/cookies";

@Component({
  selector: 'app-circumstances',
  templateUrl: './circumstances.component.html',
  styleUrls: ['./circumstances.component.scss']
})
export class CircumstancesComponent extends BaseFlowComponent<CircumstanceFormComponent, CircumstanceModel> implements OnInit {
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
    this.headerService.setHeaderData({name: '§§Driver', preventBack: true});
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

                this.baseModel = car.circumstances || new CircumstanceModel({car: car.id});

                if (initial) {
                  this.formComponent?.setDefaults(this.baseModel);
                  initial = false;
                }
              })
            );
        })
      ).subscribe();
  }

  protected saveForm(circumstance: CircumstanceModel, validate = false) {
    circumstance = Object.assign(new CircumstanceModel({car: this.baseModel.car}), circumstance);
    circumstance.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: circumstance.car,
        model: circumstance
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/damaged-parts`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/driver`]);
  }
}
