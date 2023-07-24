import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepComponent } from './step.component';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { GetStepInputsPipe } from "@app/home/pages/step/pipes/get-step-inputs.pipe";
import { StackedSelectControlModule } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.module";
import { TextControlModule } from "@app/shared/form-controls/text-control/text-control.module";
import { NumberControlModule } from "@app/shared/form-controls/number-control/number-control.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";


@NgModule({
  declarations: [
    StepComponent,
    GetStepInputsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
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
  ]
})
export class StepModule { }
