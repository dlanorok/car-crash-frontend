import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
    declarations: [
        StepperComponent
    ],
    exports: [
        StepperComponent
    ],
  imports: [
    CommonModule,
    TranslocoModule
  ]
})
export class StepperModule { }
