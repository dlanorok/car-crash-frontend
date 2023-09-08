import { Component, inject, OnInit } from '@angular/core';
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { CommonApiService } from "@app/shared/api/common/common-api.service";
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { PageDataService } from "@app/shared/services/page-data.service";
import { TranslocoService } from "@ngneat/transloco";
import { Router } from "@angular/router";

@Component({
  selector: 'app-invite-participants',
  templateUrl: './invite-participants.component.html',
  styleUrls: ['./invite-participants.component.scss']
})
export class InviteParticipantsComponent implements OnInit {
  private readonly pageDataService: PageDataService = inject(PageDataService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly commonApiService: CommonApiService = inject(CommonApiService);
  private readonly translateService: TranslocoService = inject(TranslocoService);
  private readonly router: Router = inject(Router);

  location = `${window.origin}/crash/${localStorage.getItem(StorageItem.sessionId)}`;
  sessionId = localStorage.getItem(StorageItem.sessionId);
  form!: UntypedFormGroup;


  ngOnInit() {
    this.pageDataService.pageData = {
      pageName: "§§ Invite other participants",
      footerButtons: [
        {
          name$: this.translateService.selectTranslate('car-crash.shared.button.overview'),
          action: () => {
            const sessionId = localStorage.getItem(StorageItem.sessionId);
            return this.router.navigate([`/crash/${sessionId}`]);
          },
          icon: 'bi-house'
        },
        {
          name$: this.translateService.selectTranslate('car-crash.shared.button.next'),
          action: () => {
            const sessionId = localStorage.getItem(StorageItem.sessionId);
            return this.router.navigate([`/crash/${sessionId}`]);
          },
          icon: 'bi-chevron-right'
        },
      ]
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
