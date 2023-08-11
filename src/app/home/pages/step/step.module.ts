import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepComponent } from './step.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GetStepInputsPipe } from "@app/home/pages/step/pipes/get-step-inputs.pipe";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { ToDatePipe } from "@app/home/pages/step/pipes/to-date.pipe";
import { DynamicControlFromInputModule } from "@app/shared/common/pipes/dynamic-control-from-input/dynamic-control-from-input.module";
import { DynamicControlDirective } from "@app/shared/common/directives/dynamic-control.directive";


@NgModule({
  declarations: [
    StepComponent,
    GetStepInputsPipe,
    ToDatePipe,
    DynamicControlDirective
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
    FooterButtonsModule,
    DynamicControlFromInputModule,
  ]
})
export class StepModule { }
