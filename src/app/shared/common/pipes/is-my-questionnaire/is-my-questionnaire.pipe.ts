import { inject, Pipe, PipeTransform } from '@angular/core';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";

@Pipe({
  name: 'isMyQuestionnaire',
})
export class IsMyQuestionnairePipe implements PipeTransform {
  private readonly cookieService: CookieService = inject(CookieService);


  transform(questionnaire: QuestionnaireModel): boolean {
    return questionnaire.creator === this.cookieService.get(CookieName.sessionId);
  }
}
