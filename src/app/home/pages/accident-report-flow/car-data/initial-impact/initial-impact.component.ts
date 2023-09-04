import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, of, switchMap, tap } from "rxjs";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { loadCars } from "@app/app-state/car/car-action";
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-initial-impact',
  templateUrl: './initial-impact.component.html',
  styleUrls: ['./initial-impact.component.scss']
})
export class InitialImpactComponent implements OnInit {
  cars$: Observable<CarModel[]> = this.store.select(selectCars);
  car?: CarModel;

  constructor(
    private readonly pageDataService: PageDataService,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.pageDataService.pageData = {pageName: '§§Damaged parts'};
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
