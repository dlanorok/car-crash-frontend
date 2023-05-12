import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarFormComponent } from './car-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";



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
  ]
})
export class CarFormModule { }
