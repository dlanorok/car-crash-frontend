import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, of, switchMap, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { HeaderService } from "@app/shared/services/header-service";
import { Store } from "@ngrx/store";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { loadCars } from "@app/app-state/car/car-action";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";

@Component({
  selector: 'app-damaged-parts',
  templateUrl: './damaged-parts.component.html',
  styleUrls: ['./damaged-parts.component.scss']
})
export class DamagedPartsComponent extends BaseFooterComponent implements OnInit {
  cars$: Observable<CarModel[]> = this.store.select(selectCars);
  car?: CarModel;

  constructor(
    private readonly headerService: HeaderService,
    private readonly store: Store,
    private readonly route: ActivatedRoute
  ) {
    super();
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

  next() {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/${this.car?.id}/initial-impact`]);
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/${this.car?.id}/circumstances`]);
  }
}
