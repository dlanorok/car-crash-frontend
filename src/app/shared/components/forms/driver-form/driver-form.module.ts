import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { DriverFormComponent } from "./driver-form.component";
import { DateControlModule } from "../../../form-controls/date-control/date-control.module";
import { TextControlModule } from "../../../form-controls/text-control/text-control.module";
import { TextAreaControlModule } from "@app/shared/form-controls/text-area-control/text-area-control.module";


@NgModule({
  declarations: [
    DriverFormComponent
  ],
  exports: [
    DriverFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    DateControlModule,
    TextControlModule,
    TextAreaControlModule
  ]
})
export class DriverFormModule { }
