import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code.component';
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";



@NgModule({
  declarations: [
    QrCodeComponent
  ],
  exports: [
    QrCodeComponent
  ],
  imports: [
    CommonModule,
    NgxQRCodeModule,
  ]
})
export class QrCodeModule { }
