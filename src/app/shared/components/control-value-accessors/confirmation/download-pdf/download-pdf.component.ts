import { Component, inject, Input } from '@angular/core';
import { Step } from "@app/home/pages/crash/flow.definition";
import { concatMap, interval, Observable, of, publishReplay, refCount, switchMap, take, takeWhile } from "rxjs";
import { CrashesApiService } from "@app/shared/api/crashes/crashes-api.service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.scss'],
  providers: [provideControlValueAccessor(DownloadPdfComponent)],
})
export class DownloadPdfComponent extends BaseFormControlComponent<boolean> {
  private readonly crashesApiService: CrashesApiService = inject(CrashesApiService);
  private readonly filesApiService: FilesApiService = inject(FilesApiService);

  @Input() step?: Step;

  pdfLink$: Observable<string | undefined> = interval(1000).pipe(
    concatMap(() => {
      const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
      if (!sessionId) {
        return of(undefined);
      }
      return this.crashesApiService.getSingle(sessionId).pipe(
        switchMap(crash => {
          if (!crash?.pdf) {
            return of(undefined);
          }
          return this.filesApiService.getFileData(crash.pdf).pipe(
            map(data => data.file)
          );
        })
      );
    }),
    takeWhile((pdfLink) => !pdfLink, true),
    publishReplay(1),
    refCount()
  );

  downloadPdf(): void {
    this.pdfLink$.pipe(
      take(1)
    ).subscribe((pdfLink) => {
      if (pdfLink) {
        window.open(pdfLink, '_blank');
      }
    });
  }
}
