import { Component, inject, OnInit } from '@angular/core';
import { take } from "rxjs";
import { Router } from "@angular/router";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { getStartingLink } from "@app/shared/common/helpers/get-starting-link";
import { QuestionnairesApiService } from "@app/shared/api/questionnaires/questionnaires-api.service";

@Component({
  selector: 'app-join-crash',
  templateUrl: './join-crash.component.html',
  styleUrls: ['./join-crash.component.scss']
})
export class JoinCrashComponent implements OnInit {
  private readonly questionnairesApiService: QuestionnairesApiService = inject(QuestionnairesApiService);
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  private readonly router: Router = inject(Router);

  ngOnInit() {
    this.questionnairesApiService.create(new QuestionnaireModel()).pipe(take(1)).subscribe((questionnaireModel) => {
      this.questionnaireService.updateQuestionnaire(questionnaireModel);
      this.router.navigate([getStartingLink(questionnaireModel)]);
    });
  }
}
