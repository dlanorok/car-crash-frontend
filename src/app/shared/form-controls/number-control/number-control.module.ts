import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberControlComponent } from './number-control.component';
import { ReactiveFormsModule } from "@angular/forms";
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
    FormErrorsModule
  ]
})
export class NumberControlModule {
}
