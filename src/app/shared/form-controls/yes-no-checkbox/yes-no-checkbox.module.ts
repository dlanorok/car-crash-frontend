import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YesNoCheckboxComponent } from './yes-no-checkbox.component';
import { FormErrorsModule } from "../../components/forms/shell/form-errors/form-errors.module";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    YesNoCheckboxComponent
  ],
  exports: [
    YesNoCheckboxComponent
  ],
  imports: [
    CommonModule,
    FormErrorsModule,
    ReactiveFormsModule,
    FormErrorsModule
  ]
})
export class YesNoCheckboxModule {
}
