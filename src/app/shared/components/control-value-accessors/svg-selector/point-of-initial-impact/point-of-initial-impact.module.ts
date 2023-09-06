import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfInitialImpactComponent } from './point-of-initial-impact.component';
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";

@NgModule({
  declarations: [
    PointOfInitialImpactComponent
  ],
  exports: [
    PointOfInitialImpactComponent
  ],
  imports: [
    CommonModule,
    FormErrorsModule
  ]
})
export class PointOfInitialImpactModule {
}
