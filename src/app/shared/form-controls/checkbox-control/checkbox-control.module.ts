import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxControlComponent } from './checkbox-control.component';
import { ReactiveFormsModule } from "@angular/forms";
import { FormErrorsModule } from "../../components/forms/shell/form-errors/form-errors.module";



@NgModule({
  declarations: [
    CheckboxControlComponent
  ],
  exports: [
    CheckboxControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsModule
  ]
})
export class CheckboxControlModule { }
