import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalStepComponent } from './final-step.component';
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";
import { ChapterModule } from "@app/shared/components/chapter/chapter.module";



@NgModule({
  declarations: [
    FinalStepComponent
  ],
  imports: [
    CommonModule,
    InputSectionModule,
    TranslocoModule,
    ChapterModule
  ]
})
export class FinalStepModule { }
