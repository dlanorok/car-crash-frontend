import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { CarsApiService } from "../../../api/cars/cars-api.service";
import { CarModel } from "../../../models/car.model";
import { take } from "rxjs";
import { updateCarInitialImpact } from "../../../../app-state/car/car-action";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-point-of-initial-impact',
  templateUrl: './point-of-initial-impact.component.html',
  styleUrls: ['./point-of-initial-impact.component.scss']
})
export class PointOfInitialImpactComponent extends BaseSvgHoverComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {

  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly store: Store
  ) {
    super();
  }

  override onViewReady() {
    this.selectedParts = this.car.initial_impact || [];
    this.svgImage?.nativeElement.querySelectorAll('g').forEach((path) => {
      if (this.car.initial_impact?.includes(path.id)) {
        path.classList.add(this.selectedClass);
      } else {
        path.classList.remove(this.selectedClass);
      }
    });
  }

  override addListeners() {
    this.svgImage?.nativeElement.querySelectorAll('g').forEach((path) => {
      this.listeners.push(this.renderer2.listen(path, 'click', this.onPathClick.bind(this)));
    });
  }

  override afterSvgItemClicked() {
    const car = new CarModel({
      id: this.car.id,
      initial_impact: this.selectedParts
    });
    this.store.dispatch(updateCarInitialImpact({carId: this.car.id, initialImpacts: this.selectedParts}));
    this.carsApiService.patch(car).pipe(take(1)).subscribe();
  }

}
