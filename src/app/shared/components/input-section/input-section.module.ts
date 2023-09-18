import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSectionComponent } from './input-section.component';
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { ButtonModule } from "@app/shared/components/ui/button/button.module";



@NgModule({
  declarations: [
    InputSectionComponent
  ],
  exports: [
    InputSectionComponent
  ],
  imports: [
    CommonModule,
    SvgIconModule,
    ButtonModule
  ]
})
export class InputSectionModule { }
