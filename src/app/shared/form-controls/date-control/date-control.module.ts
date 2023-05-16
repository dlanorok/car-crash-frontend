import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateControlComponent } from './date-control.component';
import { NgbDatepicker, NgbDatepickerModule, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { TranslocoModule } from "@ngneat/transloco";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    DateControlComponent
  ],
  imports: [
    CommonModule,
    NgbDatepicker,
    NgbInputDatepicker,
    TranslocoModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  exports: [
    DateControlComponent
  ]
})
export class DateControlModule { }