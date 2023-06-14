import { AfterViewInit, Component } from "@angular/core";
import { BaseModel } from "@app/shared/models/base.model";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { map } from "rxjs/operators";
import { Observable, switchMap, tap } from "rxjs";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";

@Component({
  template: '',
})
export abstract class BaseFlowCarSubModelComponent<T, C extends BaseModel> extends BaseFlowComponent<T, C> implements AfterViewInit {
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  abstract setFormData(car: CarModel): void;

  observeStoreChange(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('carId')),
        switchMap((carId: string | null) => {
          return this.cars$.pipe(
            tap((cars: CarModel[]) => {
              const car = cars.find(_car => _car.id.toString() === carId);
              if (car) {
                this.setFormData(car);
              }
            })
          );
        })
      ).subscribe();
  }
}
