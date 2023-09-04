import { Component, OnInit } from '@angular/core';
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { CommonApiService } from "@app/shared/api/common/common-api.service";
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { Observable } from "rxjs";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { Store } from "@ngrx/store";
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-invite-participants',
  templateUrl: './invite-participants.component.html',
  styleUrls: ['./invite-participants.component.scss']
})
export class InviteParticipantsComponent implements OnInit {
  location = `${window.origin}/crash/${localStorage.getItem(StorageItem.sessionId)}`;
  sessionId = localStorage.getItem(StorageItem.sessionId);
  form!: UntypedFormGroup;
  crash$: Observable<CrashModel> = this.store.select(selectCrash);

  constructor(
    private readonly pageDataService: PageDataService,
    private readonly formBuilder: FormBuilder,
    private readonly commonApiService: CommonApiService,
    private readonly store: Store
  ) {}

  ngOnInit() {
    this.pageDataService.pageData = {
      pageName: "§§ Invite other participants",
    };

    this.form = this.formBuilder.group(
      {
        phone_number: [''],
      }
    );
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
