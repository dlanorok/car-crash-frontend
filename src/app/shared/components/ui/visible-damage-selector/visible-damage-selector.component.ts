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
import { CarsApiService } from "../../../api/cars/cars-api.service";
import { CarModel } from "../../../models/car.model";
import { take } from "rxjs";
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { Store } from "@ngrx/store";
import { updateCarDamagedParts } from "@app/app-state/car/car-action";

@Component({
  selector: 'app-visible-damage-selector',
  templateUrl: './visible-damage-selector.component.html',
  styleUrls: ['./visible-damage-selector.component.scss']
})
export class VisibleDamageSelectorComponent extends BaseSvgHoverComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {

  @ViewChild('visibleDamage') visibleDamage?: ElementRef<SVGElement>;

  constructor(
    private readonly carsApiService: CarsApiService,
    private readonly renderer2: Renderer2,
    private readonly store: Store
  ) {
    super();
  }

  override onViewReady() {
    this.selectedParts = [...(this.car.damaged_parts || [])];
    this.visibleDamage?.nativeElement.querySelectorAll('path').forEach((path) => {
      this.listeners.push(this.renderer2.listen(path, 'click', this.onPathClick.bind(this)));
      if (this.car.damaged_parts?.includes(path.id)) {
        path.classList.add(this.selectedClass);
      }
    });
  }

  override afterSvgItemClicked() {
    const car = new CarModel({
      id: this.car.id,
      damaged_parts: this.selectedParts
    });
    this.store.dispatch(updateCarDamagedParts({carId: this.car.id, damagedParts: this.selectedParts}));
    this.carsApiService.patch(car).pipe(take(1)).subscribe();
  }

}
