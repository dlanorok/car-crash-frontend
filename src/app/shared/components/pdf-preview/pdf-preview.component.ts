import { Component, inject, OnInit } from '@angular/core';
import { loadCrash } from "@app/app-state/crash/crash-action";
import { Store } from "@ngrx/store";
import { filter, Observable, of, switchMap } from "rxjs";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { Router } from "@angular/router";
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { FileModel } from "@app/shared/models/fileModel";
import { map } from "rxjs/operators";
import { PageDataService } from "@app/shared/services/page-data.service";

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

  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  pdf$: Observable<string> = this.crash$.pipe(
    switchMap((crash) => {
      return crash.pdf ? this.filesApiService.getFileData(crash.pdf) : of(undefined);
    }),
    filter((pdf: FileModel | undefined): pdf is FileModel => !!pdf),
    map(pdf => pdf.file.replace("http://127.0.0.1:8000", ""))
  );


  ngOnInit() {
    this.pageDataService.pageData = {pageName: '§§Accident statement'};
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId}));
  }
}
