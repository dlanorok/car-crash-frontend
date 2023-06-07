import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverComponent } from './driver.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { DriverFormModule } from "@app/shared/components/forms/driver-form/driver-form.module";
import { ApiModule } from "@app/shared/api/api.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { OcrComponentModule } from "@app/shared/components/ocr-component/ocr-component.module";


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
        component: DriverComponent,
      }
    ]),
    TranslocoModule,
    DriverFormModule,
    FooterButtonsModule,
    SvgIconModule,
    OcrComponentModule
  ],
})
export class DriverModule { }
