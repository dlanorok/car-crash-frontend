import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberControlComponent } from './phone-number-control.component';
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    PhoneNumberControlComponent
  ],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    FormErrorsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PhoneNumberControlComponent
  ]
})
export class PhoneNumberControlModule { }
