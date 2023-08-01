import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsButtonComponent } from './google-maps-button.component';



@NgModule({
  declarations: [
    GoogleMapsButtonComponent
  ],
  exports: [
    GoogleMapsButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GoogleMapsButtonModule { }
