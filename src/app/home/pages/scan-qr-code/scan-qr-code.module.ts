import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanQrCodeComponent } from './scan-qr-code.component';
import { NgxScannerQrcodeModule } from "ngx-scanner-qrcode";
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    ScanQrCodeComponent
  ],
  imports: [
    CommonModule,
    NgxScannerQrcodeModule,
    RouterModule.forChild([
      {
        path: "",
        component: ScanQrCodeComponent
      }
    ]),
  ]
})
export class ScanQrCodeModule { }
