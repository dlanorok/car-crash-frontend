import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStateFromSectionPipe } from "@app/shared/common/pipes/get-state-from-section.pipe";


@NgModule({
  declarations: [
    GetStateFromSectionPipe
  ],
  imports: [CommonModule
  ],
  exports: [GetStateFromSectionPipe]
})
export class GetStateFromSectionModule { }
