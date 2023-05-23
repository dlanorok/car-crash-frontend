import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircumstanceFormComponent } from './circumstance-form.component';
import { CheckboxControlModule } from "../../../form-controls/checkbox-control/checkbox-control.module";
import { TranslocoModule } from "@ngneat/transloco";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    CircumstanceFormComponent
  ],
  exports: [
    CircumstanceFormComponent
  ],
  imports: [
    CommonModule,
    CheckboxControlModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CircumstanceFormModule {
}
