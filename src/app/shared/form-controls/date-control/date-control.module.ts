import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateControlComponent } from './date-control.component';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDatepicker, NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbInputDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import { TranslocoModule } from "@ngneat/transloco";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomDateParserFormatter } from "./ngb-date-adapter";
import { CustomDatepickerI18n } from "./date-control-i18n";


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
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class DateControlModule { }
