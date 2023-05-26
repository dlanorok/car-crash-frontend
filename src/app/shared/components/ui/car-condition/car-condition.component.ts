import { Component, Input } from '@angular/core';
import { CarModel } from "../../../models/car.model";

@Component({
  selector: 'app-car-condition',
  templateUrl: './car-condition.component.html',
  styleUrls: ['./car-condition.component.scss']
})
export class CarConditionComponent {
  @Input() car!: CarModel;
  @Input() step!: number;

}
