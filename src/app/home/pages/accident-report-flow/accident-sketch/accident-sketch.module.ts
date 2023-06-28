import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentSketchComponent } from './accident-sketch.component';
import { RouterModule } from "@angular/router";
import { GoogleMapDrawerModule } from "@app/shared/components/google-map-drawer/google-map-drawer.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";



@NgModule({
  declarations: [
    AccidentSketchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: AccidentSketchComponent,
      }
    ]),
    GoogleMapDrawerModule,
    FooterButtonsModule,
  ],
  exports: [AccidentSketchComponent]
})
export class AccidentSketchModule { }
