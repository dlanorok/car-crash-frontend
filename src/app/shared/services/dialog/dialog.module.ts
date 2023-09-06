import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogContentComponent } from './internal/dialog-content.component';
import { DialogContentDirective } from "@app/shared/services/dialog/internal/dialog-content.directive";



@NgModule({
  declarations: [
    DialogContentComponent,
    DialogContentDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [DialogContentDirective]
})
export class DialogModule { }
