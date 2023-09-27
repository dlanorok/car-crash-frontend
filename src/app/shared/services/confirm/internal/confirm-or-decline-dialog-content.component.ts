import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmOrDeclineParams } from "@app/shared/components/modals/interfaces/confirm-or-decline-params";

@Component({
  templateUrl: './confirm-or-decline-dialog-content.component.html',
  styleUrls: ['./confirm-or-decline-dialog-content.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmOrDeclineDialogContentComponent {
  @Input() params?: ConfirmOrDeclineParams;
  @Output() confirmResult: EventEmitter<boolean> = new EventEmitter<boolean>();

  abort(): void {
    this.confirmResult.emit(false);
  }
  confirm(): void {
    this.confirmResult.emit(true);
  }
}
