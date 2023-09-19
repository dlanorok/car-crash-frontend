import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterComponent } from './chapter.component';
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";



@NgModule({
  declarations: [
    ChapterComponent
  ],
  exports: [
    ChapterComponent
  ],
  imports: [
    CommonModule,
    InputSectionModule
  ]
})
export class ChapterModule { }
