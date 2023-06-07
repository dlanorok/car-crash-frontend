import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { filter, map, Observable, of, switchMap, tap } from "rxjs";
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import { DriverModel } from "@app/shared/models/driver.model";
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

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent extends BaseFlowComponent<DriverFormComponent, DriverModel> implements OnInit {
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

                this.baseModel = car.driver || new DriverModel({car: car.id});

                if (initial) {
                  this.formComponent?.setDefaults(this.baseModel);
                  initial = false;
                }
              })
            );
        })
      ).subscribe();
  }

  protected saveForm(driver: DriverModel, validate = false) {
    driver = Object.assign(new DriverModel({car: this.baseModel.car}), driver);
    driver.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: driver.car,
        model: driver
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/circumstances`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/insurance-company`]);
  }
}
