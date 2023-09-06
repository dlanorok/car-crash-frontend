import { inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OpenDialogOptions } from "@app/shared/components/modals/interfaces/open-dialog-options";
import { ReturnDialogData } from "@app/shared/components/modals/interfaces/return-dialog-data";
import { DialogModule } from "@app/shared/services/dialog/dialog.module";
import { DialogContentComponent } from "@app/shared/services/dialog/internal/dialog-content.component";

@Injectable({
  providedIn: DialogModule
})
export class DialogService {
  private readonly modalService: NgbModal = inject(NgbModal);

  openDialog<C>(options: OpenDialogOptions<C>): Observable<ReturnDialogData<C>> {
    // We must use defer so the dialog isn't presented until the returned observable is subscribed
    return defer(() => {
      const dialogRef = this.modalService.open(DialogContentComponent, options.options);

      if (dialogRef.componentInstance) {
        (dialogRef.componentInstance.options as OpenDialogOptions<C>) = options;
        dialogRef.componentInstance.dialogRef = dialogRef;
      }

      return dialogRef.componentInstance!.componentRef.pipe(
        map((componentRef: any) => {
          const returnData: ReturnDialogData<C> = {
            afterClose$: dialogRef.closed,
            componentInstance: componentRef.instance as C,
            close: () => {
              dialogRef.close();
            },
          };
          return returnData;
        }),
      ) as Observable<ReturnDialogData<C>>;
    });
  }
}
