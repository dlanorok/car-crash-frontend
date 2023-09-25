import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteComponent } from './invite.component';
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";
import { PhoneNumberControlModule } from "@app/shared/form-controls/phone-number-control/phone-number-control.module";
import { InfoSectionModule } from "@app/shared/components/info-section/info-section.module";
import { QRCodeModule } from "angularx-qrcode";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    InviteComponent
  ],
  imports: [
    CommonModule,
    InputSectionModule,
    TranslocoModule,
    PhoneNumberControlModule,
    InfoSectionModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InviteModule { }
