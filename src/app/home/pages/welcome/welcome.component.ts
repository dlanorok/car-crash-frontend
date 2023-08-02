import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { CrashModel } from "../../../shared/models/crash.model";
import { HeaderService } from "../../../shared/services/header-service";
import { StorageItem } from "../../../shared/common/enumerators/storage";
import { Observable } from "rxjs";
import { createCrash } from '@app/app-state/crash/crash-action';
import { crashLoading } from "@app/app-state/crash/crash-selector";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  localStorageCrash?: string | null;
  loading$: Observable<boolean> = this.store.select(crashLoading);

  constructor(
    private readonly store: Store,
    private readonly headerService: HeaderService,
  ) {
  }

  createCrash() {
    this.store.dispatch(createCrash({crash: new CrashModel()}));
  }

  ngOnInit(): void {
    this.headerService.setHeaderData({
      name: '§§Car Crash assist'
    });
    this.localStorageCrash = localStorage.getItem(StorageItem.sessionId);
  }
}
