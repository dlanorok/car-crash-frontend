import { Component, OnInit } from '@angular/core';
import { HeaderService } from "@app/shared/services/header-service";
import { filter, Observable, tap } from "rxjs";
import { CrashFormComponent } from "@app/shared/components/forms/crash-form/crash-form.component";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { loadCrash, updateCrash } from "@app/app-state/crash/crash-action";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";

@Component({
  selector: 'app-accident-data',
  templateUrl: './accident-data.component.html',
  styleUrls: ['./accident-data.component.scss']
})
export class AccidentDataComponent extends BaseFlowComponent<CrashFormComponent, CrashModel> implements OnInit {
  crash$: Observable<CrashModel> = this.store.select(selectCrash);

  constructor(
    private readonly headerService: HeaderService,
  ) {
    super();
  }

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Basic accident data', preventBack: true});
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId: sessionId }));
  }

  observeStoreChange() {
    this.crash$.pipe(
      filter((crash: CrashModel) => {
        return !!crash.id;
      }),
      tap((crash: CrashModel) => {
        this.formComponent?.setDefaults(crash);
      }),
    ).subscribe();
  }

  protected saveForm(crash: CrashModel, validate = false) {
    crash.validate = validate;
    this.store.dispatch(updateCrash({
      crash: crash
    }));

    if (validate) {
      this.nextPage();
    }
  }

  protected nextPage() {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/invite`]);
  }


  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}`]);
  }
}
