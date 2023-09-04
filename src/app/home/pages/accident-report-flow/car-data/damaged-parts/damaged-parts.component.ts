import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, of, switchMap, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { loadCars } from "@app/app-state/car/car-action";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { PageDataService } from "@app/shared/services/page-data.service";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: 'app-damaged-parts',
  templateUrl: './damaged-parts.component.html',
  styleUrls: ['./damaged-parts.component.scss']
})
export class DamagedPartsComponent implements OnInit {
  cars$: Observable<CarModel[]> = this.store.select(selectCars);
  car?: CarModel;

  constructor(
    private readonly pageDataService: PageDataService,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translateService: TranslocoService
  ) {
  }

  ngOnInit() {
    this.pageDataService.pageData = {
      pageName: '§§Damaged parts',
      footerButtons: [
        {
          name$: this.translateService.selectTranslate('car-crash.shared.button.overview'),
          action: () => {
            const sessionId = localStorage.getItem(StorageItem.sessionId);
            return this.router.navigate([`/crash/${sessionId}`]);
          },
          icon: 'bi-house'
        },
      ]
    };
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
              tap((cars: CarModel[]) => {
                const car = cars.find(_car => _car.id.toString() === carId);

                if (!car) {
                  return;
                }

                this.car = car;
              }),
            );
        })
      ).subscribe();
  }
}
