import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberControlComponent } from './number-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";


@NgModule({
  declarations: [
    NumberControlComponent
  ],
  exports: [
    NumberControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FormsModule
  ]
})
export class NumberControlModule {
}
