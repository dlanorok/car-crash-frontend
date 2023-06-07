import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";
import { QrCodeModule } from "../../../shared/components/qr-code/qr-code.module";


@NgModule({
  declarations: [
    CrashComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    TranslocoModule,
    RouterModule.forChild([
      {
        path: "",
        component: CrashComponent,
      }
    ]),
    QrCodeModule
  ]
})
export class CrashModule { }
