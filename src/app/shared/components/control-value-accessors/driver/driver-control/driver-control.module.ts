import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverControlComponent } from './driver-control.component';
import { OcrComponentModule } from "@app/shared/components/ocr-component/ocr-component.module";
import { DriverFormModule } from "@app/shared/components/forms/driver-form/driver-form.module";



@NgModule({
  declarations: [
    DriverControlComponent
  ],
  exports: [
    DriverControlComponent
  ],
  imports: [
    CommonModule,
    OcrComponentModule,
    DriverFormModule
  ]
})
export class DriverControlModule { }
