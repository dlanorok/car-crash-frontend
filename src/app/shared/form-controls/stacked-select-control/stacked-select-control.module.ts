import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedSelectControlComponent } from './stacked-select-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    StackedSelectControlComponent
  ],
  exports: [
    StackedSelectControlComponent
  ],
  imports: [
    CommonModule, FormsModule,
    ReactiveFormsModule,
  ]
})
export class StackedSelectControlModule { }
