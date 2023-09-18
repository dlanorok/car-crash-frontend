import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { CrashModel } from "@app/shared/models/crash.model";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { createCrash } from '@app/app-state/crash/crash-action';
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  localStorageCrash?: string | null;

  constructor(
    private readonly store: Store,
    private readonly pageDataService: PageDataService,
  ) {
  }

  createCrash() {
    this.store.dispatch(createCrash({crash: new CrashModel()}));
  }

  ngOnInit(): void {
    this.pageDataService.pageData = {
      pageName: '§§Car Crash assist'
    };
    this.localStorageCrash = localStorage.getItem(StorageItem.sessionId);
  }
}
