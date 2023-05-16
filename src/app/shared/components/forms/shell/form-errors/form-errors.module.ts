import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from './form-errors.component';
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
  declarations: [
    FormErrorsComponent
  ],
  exports: [
    FormErrorsComponent
  ],
  imports: [
    CommonModule,
    TranslocoModule
  ]
})
export class FormErrorsModule { }
