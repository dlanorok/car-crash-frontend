import { Component, inject, OnInit } from '@angular/core';
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { Router } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { QuestionnairesApiService } from "@app/shared/api/questionnaires/questionnaires-api.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { take } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { getStartingLink } from "@app/shared/common/helpers/get-starting-link";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";

@UntilDestroy()
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private readonly questionnairesApiService: QuestionnairesApiService = inject(QuestionnairesApiService);
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly router: Router = inject(Router);

  createCrash() {
    this.cookieService.delete(CookieName.sessionId);
    this.questionnairesApiService.create(new QuestionnaireModel()).pipe(take(1)).subscribe((questionnaireModel) => {
      this.questionnaireService.updateQuestionnaire(questionnaireModel);
      this.router.navigate([getStartingLink(questionnaireModel)]);
    });
  }

  ngOnInit(): void {
    // For now delete localStorage
    localStorage.removeItem(StorageItem.sessionId);
  }
}
