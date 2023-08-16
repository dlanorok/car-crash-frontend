import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaControlComponent } from './text-area-control.component';
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    TextAreaControlComponent
  ],
  imports: [
    CommonModule,
    FormErrorsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [TextAreaControlComponent]
})
export class TextAreaControlModule { }
