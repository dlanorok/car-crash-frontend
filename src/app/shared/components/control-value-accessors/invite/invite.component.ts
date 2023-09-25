import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { CommonApiService } from "@app/shared/api/common/common-api.service";
import { Step } from "@app/home/pages/crash/flow.definition";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { FormBuilder } from "@angular/forms";
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { Observable, of, switchMap } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [provideControlValueAccessor(InviteComponent)],
})
export class InviteComponent extends BaseFormControlComponent<ChangeData> implements OnInit {
  private readonly commonApiService: CommonApiService = inject(CommonApiService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  @Input() step!: Step;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<boolean> = new EventEmitter<boolean>();

  location = `${window.origin}/crash/${localStorage.getItem(StorageItem.sessionId)}`;

  afterSubmit(): Observable<boolean> {
    return of(this.formControl.value).pipe(
      switchMap(value => {
        if (value && value.internationalNumber) {
          return this.commonApiService.sendSms(
            this.location,
            value?.internationalNumber
          ).pipe(map(() => true));
        }

        return of(false);
      })
    );
  }
}
