import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverComponent } from './driver.component';
import { ApiModule } from "../../../shared/api/api.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";
import { TranslocoModule } from "@ngneat/transloco";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "../../../shared/common/date/ngb-date-adapter";


@NgModule({
  declarations: [
    DriverComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: DriverComponent
          }
        ]
      }
    ]),
    TranslocoModule,
    NgbInputDatepicker
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class DriverModule { }
