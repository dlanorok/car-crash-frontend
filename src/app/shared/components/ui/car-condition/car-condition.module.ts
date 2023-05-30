import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarConditionComponent } from './car-condition.component';
import { VisibleDamageSelectorModule } from "../visible-damage-selector/visible-damage-selector.module";
import { PointOfInitialImpactModule } from "../point-of-initial-impact/point-of-initial-impact.module";
import { FileUploadModule } from "../../file-upload/file-upload.module";



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
        PointOfInitialImpactModule,
        FileUploadModule
    ]
})
export class CarConditionModule { }
