import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllStepsCompletedPipe } from "@app/shared/common/pipes/all-steps-completed/all-steps-completed.pipe";


@NgModule({
  declarations: [AllStepsCompletedPipe],
  imports: [
    CommonModule
  ],
  exports: [AllStepsCompletedPipe]
})
export class AllStepsCompletedModule { }
