import { inject, Injectable, OnDestroy } from "@angular/core";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnairesApiService } from "@app/shared/api/questionnaires/questionnaires-api.service";
import { Observable, of, Subject, take, tap } from "rxjs";
import { map } from "rxjs/operators";
import { Input } from "@app/home/pages/crash/flow.definition";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService implements OnDestroy {
  private readonly questionnairesApiService: QuestionnairesApiService = inject(QuestionnairesApiService);

  questionnairesUpdates$: Subject<QuestionnaireModel[]> = new Subject<QuestionnaireModel[]>();

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

  updateInputs(inputs: Record<string, string>, questionnaire: QuestionnaireModel) {
    this.questionnaires.map(_questionnaire => {
      if (_questionnaire.id === questionnaire.id) {
        const inputIds = Object.keys(inputs);
        questionnaire.data.inputs.map((input) => {
          if (inputIds.includes(input.id.toString())) {
            input.value = inputs[input.id];
            return input;
          } else {
            return input;
          }
        });
      } else {
        return _questionnaire;
      }
    });
    this.questionnairesApiService.updateInputs(questionnaire.id, inputs).pipe(take(1)).subscribe();
  }

  updateQuestionnaire(questionnaire: QuestionnaireModel): void {
    this.questionnaires = this.questionnaires.map(
      _questionnaire => _questionnaire.id === questionnaire.id ? questionnaire : _questionnaire
    );
    this.questionnairesUpdates$.next(this.questionnaires);
  }

  ngOnDestroy() {
    this.questionnairesUpdates$.complete();
  }
}

