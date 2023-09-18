import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceSelectorComponent } from './place-selector.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { StackedSelectControlModule } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.module";
import { FormsModule } from "@angular/forms";
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { TranslocoModule } from "@ngneat/transloco";



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
    StackedSelectControlModule,
    FormsModule,
    InputSectionModule,
    SvgIconModule,
    TranslocoModule
  ]
})
export class PlaceSelectorModule { }
