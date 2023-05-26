import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { TranslocoModule } from "@ngneat/transloco";
import { SvgIconModule } from "../ui/svg-icon/svg-icon.module";



@NgModule({
    declarations: [
        StepperComponent
    ],
    exports: [
        StepperComponent
    ],
    imports: [
        CommonModule,
        TranslocoModule,
        SvgIconModule
    ]
})
export class StepperModule { }
