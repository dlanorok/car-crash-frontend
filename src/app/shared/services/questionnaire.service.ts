import { inject, Injectable, OnDestroy } from "@angular/core";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnairesApiService } from "@app/shared/api/questionnaires/questionnaires-api.service";
import { Observable, of, pairwise, startWith, Subject, take, tap } from "rxjs";
import { map } from "rxjs/operators";
import { Step } from "@app/home/pages/crash/flow.definition";
import { sketchInputId } from "@app/shared/common/constants";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService implements OnDestroy {
  private readonly questionnairesApiService: QuestionnairesApiService = inject(QuestionnairesApiService);
  private readonly cookieService: CookieService = inject(CookieService);
  protected readonly toastr: ToastrService = inject(ToastrService);


  questionnairesUpdates$: Subject<QuestionnaireModel[]> = new Subject<QuestionnaireModel[]>();

  questionnaires: QuestionnaireModel[] = [];

  constructor() {
    this.observeSketchChanges();
  }

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

  saveQuestionnaire(questionnaire: QuestionnaireModel): void {
    this.questionnairesApiService.put(questionnaire).pipe(take(1)).subscribe();
  }

  updateInputs(inputs: Record<string, any>, questionnaire: QuestionnaireModel, step: Step) {
    this.questionnaires = this.questionnaires.map(_questionnaire => {
      if (_questionnaire.id === questionnaire.id) {
        const inputIds = Object.keys(inputs);
        inputIds.forEach(inputId => {
          questionnaire.data.inputs[inputId].value = inputs[inputId];
        });
        return questionnaire;
      } else {
        return _questionnaire;
      }
    });
    this.questionnairesApiService.updateInputs(questionnaire.id, inputs).pipe(
      take(1),
      tap((_questionnaire: QuestionnaireModel) => {
        if (step.updated_inputs) {
          this.updateQuestionnaireInputs(_questionnaire, step.updated_inputs);
          this.questionnairesUpdates$.next(this.questionnaires);
        }
      })
    ).subscribe();
  }

  updateQuestionnaireInputs(questionnaire: QuestionnaireModel, input_ids: string[]) {
    this.questionnaires = this.questionnaires.map(_questionnaire => {
      if (_questionnaire.id === questionnaire.id) {
        input_ids.forEach(input_id => {
          _questionnaire.data.inputs[input_id] = questionnaire.data.inputs[input_id];
        });
        return {..._questionnaire};
      } else {
        return _questionnaire;
      }
    });
  }

  observeSketchChanges() {
    this.questionnairesUpdates$.pipe(
      untilDestroyed(this),
      startWith(undefined),
      pairwise()
    ).subscribe(([previous, current]) => {
      if (!previous || !current) {
        return;
      }
      const previousConfirmedEditors = previous[0].data.inputs[sketchInputId].value.confirmed_editors || [];
      const currentConfirmedEditors = current[0].data.inputs[sketchInputId].value.confirmed_editors || [];
      const editor = this.cookieService.get(CookieName.sessionId);
      if (previousConfirmedEditors.includes(editor) && !currentConfirmedEditors.includes(editor)) {
        this.toastr.warning('§§ Sketch data has been changed. You have to confirm the sketch again');
      }
    });
  }

  updateQuestionnaire(questionnaire: QuestionnaireModel): void {
    const index = this.questionnaires.findIndex(q => q.id === questionnaire.id);
    if (index < 0) {
      this.questionnaires.push({...questionnaire});
    } else {
      this.questionnaires[index] = {...questionnaire};
    }
    this.questionnairesUpdates$.next(this.questionnaires);
  }

  ngOnDestroy() {
    this.questionnairesUpdates$.complete();
  }
}

