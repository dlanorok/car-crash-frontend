import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
  declarations: [
    SummaryComponent
  ],
  imports: [
    CommonModule,
    InputSectionModule,
    TranslocoModule
  ]
})
export class SummaryModule { }
