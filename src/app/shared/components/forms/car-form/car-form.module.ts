import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarFormComponent } from './car-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { TextControlModule } from "../../../form-controls/text-control/text-control.module";



@NgModule({
  declarations: [
    CarFormComponent
  ],
  exports: [
    CarFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    TextControlModule,
  ]
})
export class CarFormModule { }
