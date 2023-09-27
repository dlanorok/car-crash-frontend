import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { map, Observable, OperatorFunction, pipe, race } from 'rxjs';
import { first, skipWhile, switchMap, tap } from 'rxjs/operators';
import { ReturnDialogData } from "@app/shared/components/modals/interfaces/return-dialog-data";
import { DialogService } from "@app/shared/services/dialog/dialog.service";
import { ConfirmOrDeclineParams } from "@app/shared/components/modals/interfaces/confirm-or-decline-params";
import { ConfirmOrDeclineDialogContentModule } from "@app/shared/services/confirm/internal/confirm-or-decline-dialog-content.module";
import { ConfirmOrDeclineDialogContentComponent } from "@app/shared/services/confirm/internal/confirm-or-decline-dialog-content.component";

@Injectable()
export class ConfirmService {
  constructor(
    private readonly dialogService: DialogService,
    private readonly translateService: TranslocoService
  ){}

  confirmOrDecline(params: ConfirmOrDeclineParams): Observable<boolean | never> {
    return this.dialogService
      .openDialog({
        title$: this.translateService.selectTranslate(params.message, params.translationVariables),
        componentData: {
          component: ConfirmOrDeclineDialogContentComponent,
          module: ConfirmOrDeclineDialogContentModule,
        },
        componentParams: {
          params: params,
        },
        options: {
          size: 'xl',
          centered: true
        },
        isClosable: false,
      })
      .pipe(
        this.waitForConfirmResult(undefined),
        first(),
        skipWhile(result => result === undefined),
        map(result => result as unknown as boolean),
      );
  }

  private waitForConfirmResult<T extends boolean | undefined>(
    afterCloseFallbackValue: T,
  ): OperatorFunction<ReturnDialogData<any>, T> {
    return pipe(
      switchMap(returnDialogData =>
        race(
          (returnDialogData.componentInstance.confirmResult as Observable<T>).pipe(
            tap(() => {
              setTimeout(() => returnDialogData.close());
            }),
          ),
          returnDialogData.afterClose$.pipe(map(() => afterCloseFallbackValue)),
        ),
      ),
    );
  }
}
