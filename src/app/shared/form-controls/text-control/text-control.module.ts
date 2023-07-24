import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextControlComponent } from './text-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorsModule } from "../../components/forms/shell/form-errors/form-errors.module";



@NgModule({
  declarations: [
    TextControlComponent
  ],
  exports: [
    TextControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FormsModule
  ]
})
export class TextControlModule { }
