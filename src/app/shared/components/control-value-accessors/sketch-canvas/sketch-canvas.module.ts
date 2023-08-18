import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SketchCanvasComponent } from './sketch-canvas.component';
import { CanEditSketchPipe } from "@app/shared/components/control-value-accessors/sketch-canvas/can-edit-sketch.pipe";
import { CanConfirmSketchPipe } from "@app/shared/components/control-value-accessors/sketch-canvas/can-confirm-sketch.pipe";



@NgModule({
  declarations: [
    SketchCanvasComponent,
    CanEditSketchPipe,
    CanConfirmSketchPipe
  ],
  imports: [
    CommonModule
  ],
  providers: [
    CanEditSketchPipe,
    CanConfirmSketchPipe
  ]
})
export class SketchCanvasModule { }
