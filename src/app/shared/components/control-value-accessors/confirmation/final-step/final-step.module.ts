import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalStepComponent } from './final-step.component';
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";
import { ChapterModule } from "@app/shared/components/chapter/chapter.module";

import { ReactiveFormsModule } from "@angular/forms";
import { CheckboxControlModule } from "@app/shared/form-controls/checkbox-control/checkbox-control.module";



@NgModule({
  declarations: [
    FinalStepComponent
  ],
  imports: [
    CommonModule,
    InputSectionModule,
    TranslocoModule,
    ChapterModule,
    ReactiveFormsModule,
    CheckboxControlModule
  ]
})
export class FinalStepModule { }
