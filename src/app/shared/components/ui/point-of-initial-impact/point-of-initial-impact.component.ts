import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
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

  @ViewChild('pointOfInitialImpact') pointOfInitialImpact?: ElementRef<SVGElement>;

  constructor(
    private readonly renderer2: Renderer2,
    private readonly carsApiService: CarsApiService,
    private readonly store: Store
  ) {
    super();
  }

  override onViewReady() {
    this.selectedParts = this.car.initial_impact || [];
    this.pointOfInitialImpact?.nativeElement.querySelectorAll('g').forEach((g) => {
      this.listeners.push(this.renderer2.listen(g, 'click', this.onPathClick.bind(this)));
      if (this.car.initial_impact?.includes(g.id)) {
        g.classList.add(this.selectedClass);
      }
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
