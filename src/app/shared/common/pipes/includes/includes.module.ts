import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncludesPipe } from "@app/shared/common/pipes/includes/includes.pipe";



@NgModule({
  declarations: [IncludesPipe],
  imports: [
    CommonModule
  ],
  exports: [IncludesPipe]
})
export class IncludesModule { }
