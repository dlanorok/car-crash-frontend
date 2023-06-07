import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarComponent } from './car.component';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { CarFormModule } from "../../../../shared/components/forms/car-form/car-form.module";
import { InsuranceFormModule } from "../../../../shared/components/forms/insurance-form/insurance-form.module";
import { DriverFormModule } from "../../../../shared/components/forms/driver-form/driver-form.module";
import { PolicyHolderFormModule } from "../../../../shared/components/forms/policy-holder-form/policy-holder-form.module";
import { StepperModule } from "../../../../shared/components/stepper/stepper.module";
import { CircumstanceFormModule } from "../../../../shared/components/forms/circumstance-form/circumstance-form.module";
import { CarConditionModule } from "../../../../shared/components/ui/car-condition/car-condition.module";
import { OcrComponentModule } from "../../../../shared/components/ocr-component/ocr-component.module";
import { SvgIconModule } from "../../../../shared/components/ui/svg-icon/svg-icon.module";
import { FooterButtonsModule } from "../../../../shared/components/footer-buttons/footer-buttons.module";
import { ApiModule } from "../../../../shared/api/api.module";


@NgModule({
  declarations: [
    CarComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    RouterModule.forChild([
      {
        path: "",
        component: CarComponent,
      },
    ]),
    ReactiveFormsModule,
    TranslocoModule,
    CarFormModule,
    InsuranceFormModule,
    DriverFormModule,
    PolicyHolderFormModule,
    StepperModule,
    CircumstanceFormModule,
    CarConditionModule,
    OcrComponentModule,
    SvgIconModule,
    FooterButtonsModule
  ]
})
export class CarModule {}
