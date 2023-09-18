import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfInitialImpactComponent } from './point-of-initial-impact.component';
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
  declarations: [
    PointOfInitialImpactComponent
  ],
  exports: [
    PointOfInitialImpactComponent
  ],
  imports: [
    CommonModule,
    FormErrorsModule,
    InputSectionModule,
    TranslocoModule
  ]
})
export class PointOfInitialImpactModule {
}
