import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedSelectControlComponent } from './stacked-select-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";



@NgModule({
  declarations: [
    StackedSelectControlComponent
  ],
  exports: [
    StackedSelectControlComponent
  ],
  imports: [
    CommonModule, FormsModule,
    ReactiveFormsModule, FormErrorsModule, SvgIconModule,
  ]
})
export class StackedSelectControlModule { }
