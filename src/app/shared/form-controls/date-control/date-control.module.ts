import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateControlComponent } from './date-control.component';
import { NgbDatepicker, NgbDatepickerModule, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorsModule } from "../../components/forms/shell/form-errors/form-errors.module";


@NgModule({
  declarations: [
    DateControlComponent
  ],
  imports: [
    CommonModule,
    NgbDatepicker,
    NgbInputDatepicker,
    NgbDatepickerModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FormsModule
  ],
  exports: [
    DateControlComponent
  ]
})
export class DateControlModule { }
