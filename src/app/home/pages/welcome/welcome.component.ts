import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { CrashModel } from "../../../shared/models/crash.model";
import { CrashesApiService } from "../../../shared/api/crashes/crashes-api.service";
import { Router } from "@angular/router";
import { HeaderService } from "../../../shared/services/header-service";
import { createCrash } from "../../../app-state/crash/crash-action";
import { StorageItem } from "../../../shared/common/enumerators/storage";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  localStorageCrash?: string | null;

  constructor(
    private readonly store: Store,
    private readonly crashesApiService: CrashesApiService,
    private readonly router: Router,
    private readonly headerService: HeaderService
  ) {
  }

  createCrash() {
    this.store.dispatch(createCrash({crash: new CrashModel()}));
  }

  ngOnInit(): void {
    this.headerService.setHeaderData({
      name: '§§Car Crash assist',
      preventBack: true
    });
    this.localStorageCrash = localStorage.getItem(StorageItem.sessionId);
  }
}
