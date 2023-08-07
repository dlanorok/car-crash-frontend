import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInputValueFromStepPipe } from "@app/shared/common/pipes/get-input-value-from-step/get-input-value-from-step.pipe";



@NgModule({
  declarations: [GetInputValueFromStepPipe],
  imports: [
    CommonModule
  ],
  exports: [GetInputValueFromStepPipe]
})
export class GetInputValueFromStepModule { }
