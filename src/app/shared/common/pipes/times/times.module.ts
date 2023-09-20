import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesPipe } from "@app/shared/common/pipes/times/times.pipe";



@NgModule({
  declarations: [TimesPipe],
  imports: [
    CommonModule
  ],
  exports: [TimesPipe]
})
export class TimesModule { }
