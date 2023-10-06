import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { CommonApiService } from "@app/shared/api/common/common-api.service";
import { Step } from "@app/home/pages/crash/flow.definition";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { merge, Observable, of, startWith, switchMap, take } from "rxjs";
import { map } from "rxjs/operators";
import { TranslocoService } from "@ngneat/transloco";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { PhoneNumberControlComponent } from "@app/shared/form-controls/phone-number-control/phone-number-control.component";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [provideControlValueAccessor(InviteComponent)],
})
export class InviteComponent extends BaseFormControlComponent<ChangeData> implements OnInit {
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

  @Input() step!: Step;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<boolean> = new EventEmitter<boolean>();

  location = `${window.origin}/crash/${localStorage.getItem(StorageItem.sessionId)}/join`;

  @ViewChild('phoneNumberControlComponent') phoneNumberControlComponent!: PhoneNumberControlComponent;
  lastInviteNumber?: ChangeData | null;

  submit() {
    this.questionnaires$.pipe(
      map((questsionnaires) => {
        if (questsionnaires.length >= 2) {
          this.next.emit();
          return true;
        }
        return false;
      }),
      switchMap((nextStep) => {
        if (!nextStep && this.phoneNumberControlComponent?.phoneForm?.valid) {
          this.lastInviteNumber = this.phoneNumberControlComponent.phoneForm.controls.phone.value;
          return this.commonApiService.sendSms(
            `${this.traslateService.translate('car-crash.invite.sms-content')}\n${this.location}`,
            this.formControl.value?.internationalNumber
          );
        }
        return of(undefined);
      }),
      take(1)
    ).subscribe();
  }
}
