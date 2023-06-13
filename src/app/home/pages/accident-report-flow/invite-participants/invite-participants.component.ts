import { Component, OnInit } from '@angular/core';
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { HeaderService } from "@app/shared/services/header-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { CommonApiService } from "@app/shared/api/common/common-api.service";
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { Observable, take, tap } from "rxjs";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-invite-participants',
  templateUrl: './invite-participants.component.html',
  styleUrls: ['./invite-participants.component.scss']
})
export class InviteParticipantsComponent extends BaseFooterComponent implements OnInit {
  location = `${window.origin}/crash/${localStorage.getItem(StorageItem.sessionId)}`;
  sessionId = localStorage.getItem(StorageItem.sessionId);
  form!: UntypedFormGroup;
  crash$: Observable<CrashModel> = this.store.select(selectCrash);

  constructor(
    private readonly headerService: HeaderService,
    private readonly formBuilder: FormBuilder,
    private readonly commonApiService: CommonApiService,
    private readonly store: Store
  ) {
    super();
  }

  ngOnInit() {
    this.headerService.setHeaderData({
      name: "§§ Invite other participants",
      preventBack: true
    });

    this.form = this.formBuilder.group(
      {
        phone_number: [''],
      }
    );
  }

  next(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.crash$.pipe(
      take(1),
      tap((crash: CrashModel) => {
        if (crash.cars) {
          this.router.navigate([`/crash/${sessionId}/cars/${crash.cars?.[0]}/policy-holder`]);
        } else {
          // TODO what else?
        }
      })
    ).subscribe();
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/accident-data`]);
  }

  sendSms() {
    if (this.form.valid) {
      this.commonApiService.sendSms(
        this.location,
        (this.form.controls['phone_number'].value as ChangeData).internationalNumber!
      ).subscribe();
    }
  }

}
