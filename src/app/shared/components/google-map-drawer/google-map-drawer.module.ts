import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapDrawerComponent } from './google-map-drawer.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { GoogleMapsButtonModule } from "@app/shared/components/ui/google-maps-button/google-maps-button.module";



@NgModule({
  declarations: [
    GoogleMapDrawerComponent,
  ],
  exports: [
    GoogleMapDrawerComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GoogleMapsButtonModule,
  ]
})
export class GoogleMapDrawerModule { }