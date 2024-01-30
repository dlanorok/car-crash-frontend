import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { CommonApiService } from "@app/shared/api/common/common-api.service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { merge, Observable, startWith, switchMap, take } from "rxjs";
import { TranslocoService } from "@ngneat/transloco";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { PhoneNumberControlComponent } from "@app/shared/form-controls/phone-number-control/phone-number-control.component";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Option } from "@app/home/pages/crash/flow.definition";

export enum InviteOption {
  sms = 'sms',
  qr = 'qr'
}

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [provideControlValueAccessor(InviteComponent)],
})
export class InviteComponent extends BaseFormControlComponent<ChangeData> {
  private readonly commonApiService: CommonApiService = inject(CommonApiService);
  private readonly traslateService: TranslocoService = inject(TranslocoService);
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  readonly questionnaires$: Observable<QuestionnaireModel[]> = merge(this.questionnaireService.questionnaireUpdates$,
    this.questionnaireService.questionnairesUpdates$).pipe(
    startWith(undefined),
    switchMap(() => {
      return this.questionnaireService.getOrFetchQuestionnaires();
    })
  );

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly InviteOption: typeof InviteOption = InviteOption;
  location = `${window.origin}/crash/${localStorage.getItem(StorageItem.sessionId)}/join`;
  options: Option[] = [
    {
      label: this.traslateService.translate('car-crash.invite.with-qr-code.label'),
      value: InviteOption.qr,
      icon: 'qr-code'
    },
    {
      label: this.traslateService.translate('car-crash.invite.with-sms.label'),
      value: InviteOption.sms,
      icon: 'car'
    },
  ];
  step: 0 | 1 | 2 = 0;
  selectedOption?: InviteOption;

  @ViewChild('phoneNumberControlComponent') phoneNumberControlComponent!: PhoneNumberControlComponent;
  lastInviteNumber?: ChangeData | null;

  get buttonName(): string {
    if (this.step === 0) {
      return 'car-crash.shared.next';
    }

    if (this.step === 1) {
      return this.selectedOption === InviteOption.sms
        ? 'car-crash.invite.send-invite'
        : 'car-crash.shared.next';
    }

    return 'car-crash.shared.next';
  }


  previous() {
    if (this.step > 0) {
      this.step--;
    } else {
      this.back.emit();
    }
  }

  submit() {
    if (this.step === 1 && this.selectedOption === InviteOption.sms) {
        if (this.phoneNumberControlComponent?.phoneForm?.valid) {
          this.lastInviteNumber = this.phoneNumberControlComponent.phoneForm.controls.phone.value;
          return this.commonApiService.sendSms(
            `${this.traslateService.translate('car-crash.invite.sms-content')}\n${this.location}`,
            this.formControl.value?.internationalNumber
          ).pipe(take(1)).subscribe(() => {
            this.step = 2;
          });
        }
    }

    if (this.step === 1 && this.selectedOption === InviteOption.qr) {
      this.next.emit();
      return;
    }

    if (this.step === 2) {
      this.next.emit();
      return;
    }

    this.step ++;
  }
}
