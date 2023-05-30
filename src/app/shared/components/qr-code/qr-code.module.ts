import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code.component';



@NgModule({
  declarations: [
    QrCodeComponent
  ],
  exports: [
    QrCodeComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class QrCodeModule { }
