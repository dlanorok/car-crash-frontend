import { inject, Injectable } from "@angular/core";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnairesApiService } from "@app/shared/api/questionnaires/questionnaires-api.service";
import { Observable, of, take, tap } from "rxjs";
import { map } from "rxjs/operators";
import { Input } from "@app/home/pages/crash/flow.definition";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private readonly questionnairesApiService: QuestionnairesApiService = inject(QuestionnairesApiService);

  questionnaires: QuestionnaireModel[] = [];

  getOrFetchQuestionnaires(): Observable<QuestionnaireModel[]> {
    if (this.questionnaires.length > 0) {
      return of(this.questionnaires);
    } else {
      return this.questionnairesApiService.getQuestionnaires()
        .pipe(
          take(1),
          tap((questionnaires) => {
            this.questionnaires = questionnaires;
          }),
          map(() => this.questionnaires)
        );
    }
  }

  saveInput(qId: number, input: Input): void {
    this.questionnaires = this.questionnaires.map((questionnaire) => {
      if (questionnaire.id == qId) {
        questionnaire.data.inputs = questionnaire.data.inputs.map(_input => {
          if (_input.id === input.id) {
            return input;
          }
          return _input;
        });
        return questionnaire;
      }

      return questionnaire;
    });
  }

  saveQuestionnaire(questionnaire: QuestionnaireModel): void {
    this.questionnairesApiService.put(questionnaire).pipe(take(1)).subscribe();
  }
}

