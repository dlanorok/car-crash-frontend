import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteComponent } from './invite.component';
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";
import { PhoneNumberControlModule } from "@app/shared/form-controls/phone-number-control/phone-number-control.module";
import { InfoSectionModule } from "@app/shared/components/info-section/info-section.module";
import { QRCodeModule } from "angularx-qrcode";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "@app/shared/components/ui/button/button.module";
import { StackedSelectControlModule } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.module";
import { IsInviteButtonDisabledPipe } from "@app/shared/components/control-value-accessors/invite/is-invite-button-disabled.pipe";



@NgModule({
  declarations: [
    InviteComponent,
    IsInviteButtonDisabledPipe
  ],
  imports: [
    CommonModule,
    InputSectionModule,
    TranslocoModule,
    PhoneNumberControlModule,
    InfoSectionModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StackedSelectControlModule
  ]
})
export class InviteModule { }
