import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmICreatorPipe } from "@app/shared/common/pipes/am-i-creator/am-i-creator.pipe";



@NgModule({
  declarations: [AmICreatorPipe],
  imports: [
    CommonModule
  ],
  exports: [AmICreatorPipe]
})
export class AmICreatorModule { }
