import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterButtonsComponent } from './footer-buttons.component';



@NgModule({
  declarations: [
    FooterButtonsComponent
  ],
  exports: [
    FooterButtonsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FooterButtonsModule { }
