import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarConditionComponent } from './car-condition.component';
import { VisibleDamageSelectorModule } from "../visible-damage-selector/visible-damage-selector.module";
import { PointOfInitialImpactModule } from "../point-of-initial-impact/point-of-initial-impact.module";



@NgModule({
  declarations: [
    CarConditionComponent
  ],
  exports: [
    CarConditionComponent
  ],
  imports: [
    CommonModule,
    VisibleDamageSelectorModule,
    PointOfInitialImpactModule
  ]
})
export class CarConditionModule { }
