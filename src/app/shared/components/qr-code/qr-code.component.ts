import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute } from "@angular/router";
import { filter, map, tap } from "rxjs";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

  NgxQrcodeElementTypes = NgxQrcodeElementTypes;
  location?: string;

  constructor(
    private readonly route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.subscribeToNavigation();
  }

  subscribeToNavigation() {
    this.route.paramMap
      .pipe(
        map(params => params.get('sessionId')),
        tap((sessionId) => {
          if (sessionId) {
            this.location = window.origin + '/crash/' + sessionId
          }
        })
      ).subscribe()
  }

}
