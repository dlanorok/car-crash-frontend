import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceSelectorComponent } from './place-selector.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { GoogleMapsButtonModule } from "@app/shared/components/ui/google-maps-button/google-maps-button.module";



@NgModule({
  declarations: [
    PlaceSelectorComponent
  ],
  exports: [
    PlaceSelectorComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    GoogleMapsButtonModule
  ]
})
export class PlaceSelectorModule { }
