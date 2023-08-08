import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicControlFromInputPipe } from "@app/shared/common/pipes/dynamic-control-from-input/dynamic-control-from-input.pipe";



@NgModule({
  declarations: [DynamicControlFromInputPipe],
  imports: [
    CommonModule
  ],
  exports: [DynamicControlFromInputPipe]
})
export class DynamicControlFromInputModule { }
