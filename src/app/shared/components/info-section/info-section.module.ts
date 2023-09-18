import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoSectionComponent } from './info-section.component';
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";



@NgModule({
  declarations: [
    InfoSectionComponent
  ],
  exports: [
    InfoSectionComponent
  ],
  imports: [
    CommonModule,
    SvgIconModule
  ]
})
export class InfoSectionModule { }
