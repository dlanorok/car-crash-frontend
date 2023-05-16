import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceFormComponent } from './insurance-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { DateControlModule } from "../../../form-controls/date-control/date-control.module";
import { TextControlModule } from "../../../form-controls/text-control/text-control.module";
import { CheckboxControlModule } from "../../../form-controls/checkbox-control/checkbox-control.module";


@NgModule({
  declarations: [
    InsuranceFormComponent
  ],
  exports: [
    InsuranceFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    DateControlModule,
    TextControlModule,
    CheckboxControlModule
  ]
})
export class InsuranceFormModule { }
