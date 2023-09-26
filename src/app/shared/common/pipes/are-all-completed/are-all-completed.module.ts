import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreAllCompletedPipe } from "@app/shared/common/pipes/are-all-completed/are-all-completed.pipe";



@NgModule({
  declarations: [AreAllCompletedPipe],
  imports: [
    CommonModule
  ],
  exports: [AreAllCompletedPipe]
})
export class AreAllCompletedModule { }
