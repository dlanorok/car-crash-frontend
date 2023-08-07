import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarIdentifierPipe } from "@app/shared/common/pipes/car-identifier/car-identifier.pipe";



@NgModule({
  declarations: [CarIdentifierPipe],
  imports: [
    CommonModule
  ],
  exports: [CarIdentifierPipe]
})
export class CarIdentifierModule { }
