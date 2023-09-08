import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceSelectorComponent } from './place-selector.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { GoogleMapsButtonModule } from "@app/shared/components/ui/google-maps-button/google-maps-button.module";
import { StackedSelectControlModule } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.module";
import { FormsModule } from "@angular/forms";



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
    GoogleMapsButtonModule,
    StackedSelectControlModule,
    FormsModule
  ]
})
export class PlaceSelectorModule { }
