import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxControlComponent } from './checkbox-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
    FormErrorsModule,
    FormsModule
  ]
})
export class CheckboxControlModule { }
