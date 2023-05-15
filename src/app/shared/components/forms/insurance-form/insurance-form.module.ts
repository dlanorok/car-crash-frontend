import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceFormComponent } from './insurance-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { DateControlModule } from "../../../form-controls/date-control/date-control.module";


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
    DateControlModule
  ]
})
export class InsuranceFormModule { }
