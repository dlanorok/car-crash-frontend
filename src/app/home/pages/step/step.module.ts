import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepComponent } from './step.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GetStepInputsPipe } from "@app/home/pages/step/pipes/get-step-inputs.pipe";
import { StackedSelectControlModule } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.module";
import { TextControlModule } from "@app/shared/form-controls/text-control/text-control.module";
import { NumberControlModule } from "@app/shared/form-controls/number-control/number-control.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { DateControlModule } from "@app/shared/form-controls/date-control/date-control.module";
import { DateTimeControlModule } from "@app/shared/form-controls/date-time-control/date-time-control.module";
import { ToDatePipe } from "@app/home/pages/step/pipes/to-date.pipe";
import { PhoneNumberControlModule } from "@app/shared/form-controls/phone-number-control/phone-number-control.module";
import { CountryControlModule } from "@app/shared/form-controls/select-control/implementations/country-control/country-control.module";
import { SelectControlModule } from "@app/shared/form-controls/select-control/select-control.module";
import { PointOfInitialImpactModule } from "@app/shared/components/control-value-accessors/svg-selector/point-of-initial-impact/point-of-initial-impact.module";
import { VisibleDamageSelectorModule } from "@app/shared/components/control-value-accessors/svg-selector/visible-damage-selector/visible-damage-selector.module";
import { PlaceSelectorModule } from "@app/shared/components/control-value-accessors/place-selector/place-selector.module";


@NgModule({
  declarations: [
    StepComponent,
    GetStepInputsPipe,
    ToDatePipe
  ],
  providers: [GetStepInputsPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: StepComponent,
      }
    ]),
    StackedSelectControlModule,
    TextControlModule,
    NumberControlModule,
    FooterButtonsModule,
    DateControlModule,
    DateTimeControlModule,
    PointOfInitialImpactModule,
    VisibleDamageSelectorModule,
    PlaceSelectorModule,
    PhoneNumberControlModule,
    CountryControlModule,
    CountryControlModule,
    SelectControlModule,
  ]
})
export class StepModule { }
