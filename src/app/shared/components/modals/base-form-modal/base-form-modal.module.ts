import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormModalComponent } from './base-form-modal.component';
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
  declarations: [
    BaseFormModalComponent
  ],
  imports: [
    CommonModule,
    TranslocoModule
  ],
  exports: [BaseFormModalComponent]
})
export class BaseFormModalModule { }
