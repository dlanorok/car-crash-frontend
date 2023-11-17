import { Pipe, PipeTransform } from '@angular/core';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { InviteOption } from "@app/shared/components/control-value-accessors/invite/invite.component";
import { AbstractControl } from "@angular/forms";

@Pipe({
  name: 'isInviteButtonDisabled',
})
export class IsInviteButtonDisabledPipe implements PipeTransform {

  transform(questionnaires: QuestionnaireModel[], step: 0 | 1 | 2, path: InviteOption | undefined, phoneNumberControl: AbstractControl): boolean {
    if (step === 0) {
      return false;
    }

    if (step === 1 && path === InviteOption.qr) {
      return questionnaires.length < 2;
    }

    if (step === 1 && path === InviteOption.sms) {
      return false;
    }

    if (step === 2 && path === InviteOption.sms) {
      return questionnaires.length < 2;
    }
    return false;
  }
}
