import { Component, OnInit } from '@angular/core';
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { filter, map, Observable, of, switchMap, take, tap } from "rxjs";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { HeaderService } from "@app/shared/services/header-service";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { loadCars } from "@app/app-state/car/car-action";
import { CookieName } from "@app/shared/common/enumerators/cookies";

@Component({
  selector: 'app-initial-impact',
  templateUrl: './initial-impact.component.html',
  styleUrls: ['./initial-impact.component.scss']
})
export class InitialImpactComponent extends BaseFooterComponent implements OnInit {
  cars$: Observable<CarModel[]> = this.store.select(selectCars);
  car?: CarModel;

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
    this.headerService.setHeaderData({name: '§§Damaged parts'});
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }

    this.getCar();
  }

  getCar() {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }
          this.store.dispatch(loadCars());

          return this.cars$
            .pipe(
              filter((cars: CarModel[]) => cars.length > 0),
              take(1),
              tap((cars: CarModel[]) => {
                const car = cars.find(
                  _car => _car.id.toString() === carId || _car.creator === this.cookieService.get(CookieName.sessionId)
                );

                if (!car) {
                  return;
                }

                this.car = car;
              }),
            );
        })
      ).subscribe();
  }

  next() {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/initial-impact`]);
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/damaged-parts`]);
  }
}
