import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbInputDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from 'src/app/shared/common/date/ngb-date-adapter';
import { DriverFormComponent } from "./driver-form.component";


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
    NgbDatepicker,
    NgbInputDatepicker,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class DriverFormModule { }
