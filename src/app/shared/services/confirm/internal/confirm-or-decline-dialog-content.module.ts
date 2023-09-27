import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ConfirmOrDeclineDialogContentComponent } from './confirm-or-decline-dialog-content.component';
import { ButtonModule } from "@app/shared/components/ui/button/button.module";

@NgModule({
  declarations: [ConfirmOrDeclineDialogContentComponent],
  imports: [CommonModule, TranslocoModule, ButtonModule],
})
export class ConfirmOrDeclineDialogContentModule {}
