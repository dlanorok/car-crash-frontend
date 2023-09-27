import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { CrashModel } from "@app/shared/models/crash.model";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { createCrash } from '@app/app-state/crash/crash-action';
import { ActivatedRoute, Params } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  localStorageCrash?: string | null;
  queryParams: Params = {};

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute
  ) {
  }

  createCrash() {
    this.store.dispatch(createCrash({crash: new CrashModel(), queryParams: this.queryParams}));
  }

  ngOnInit(): void {
    this.localStorageCrash = localStorage.getItem(StorageItem.sessionId);
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params: Params) => {
      this.queryParams = params;
    });
  }
}
