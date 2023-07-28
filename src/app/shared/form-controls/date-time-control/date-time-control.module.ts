import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDatepicker,
  NgbDatepickerModule,
  NgbInputDatepicker,
  NgbTimepickerModule
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorsModule } from "../../components/forms/shell/form-errors/form-errors.module";
import { DateTimeControlComponent } from "./date-time-control.component";


@NgModule({
  declarations: [
    DateTimeControlComponent
  ],
  imports: [
    CommonModule,
    NgbDatepicker,
    NgbInputDatepicker,
    NgbDatepickerModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FormsModule,
    NgbTimepickerModule
  ],
  exports: [
    DateTimeControlComponent
  ]
})
export class DateTimeControlModule { }
