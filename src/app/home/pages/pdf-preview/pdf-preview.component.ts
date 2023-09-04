import { Component, inject, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { filter, Observable, of, switchMap } from "rxjs";
import { CrashModel } from "@app/shared/models/crash.model";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { FileModel } from "@app/shared/models/fileModel";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { PageDataService } from "@app/shared/services/page-data.service";
import { TranslocoService } from "@ngneat/transloco";
import { CrashesApiService } from "@app/shared/api/crashes/crashes-api.service";

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly pageDataService: PageDataService = inject(PageDataService);
  private readonly filesApiService: FilesApiService = inject(FilesApiService);
  private readonly translateService: TranslocoService = inject(TranslocoService);
  private readonly crashesApiService: CrashesApiService = inject(CrashesApiService);

  crash$: Observable<CrashModel | undefined> = of(undefined).pipe(
    switchMap(() => {
      const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
      if (!sessionId) {
        this.router.navigate(["/"]);
        return of(undefined);
      }
      return this.crashesApiService.getSingle(sessionId);
    })
  );

  pdf$: Observable<string> = this.crash$.pipe(
    switchMap((crash) => {
      return crash?.pdf ? this.filesApiService.getFileData(crash.pdf) : of(undefined);
    }),
    filter((pdf: FileModel | undefined): pdf is FileModel => !!pdf),
    map(pdf => pdf.file.replace("http://127.0.0.1:8000", ""))
  );


  ngOnInit() {
    this.pageDataService.pageData = {
      pageName: '§§Accident statement',
      footerButtons: [
        {
          name$: this.translateService.selectTranslate('car-crash.shared.button.overview'),
          action: () => {
            const sessionId = localStorage.getItem(StorageItem.sessionId);
            return this.router.navigate([`/crash/${sessionId}`]);
          },
          icon: 'bi-house'
        },
      ]
    };
  }
}
