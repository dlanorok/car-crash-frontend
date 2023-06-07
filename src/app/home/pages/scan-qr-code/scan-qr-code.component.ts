import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeDevice } from "ngx-scanner-qrcode";
import { HeaderService } from "../../../shared/services/header-service";

@Component({
  selector: 'app-scan-qr-code',
  templateUrl: './scan-qr-code.component.html',
  styleUrls: ['./scan-qr-code.component.scss']
})
export class ScanQrCodeComponent implements AfterViewInit, OnInit {
  @ViewChild('qrCodeScanner') qrCodeScanner!: NgxScannerQrcodeComponent;

  constructor(
    private readonly headerService: HeaderService
  ) {
  }

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Scan QR Code'});
  }

  ngAfterViewInit() {

    this.handle(this.qrCodeScanner, 'start');
  }

  private handle(qrCodeScanner: NgxScannerQrcodeComponent | undefined, fn: string) {
    if (!qrCodeScanner) {
      return;
    }

    const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      qrCodeScanner.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      qrCodeScanner[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    }
  }
}
