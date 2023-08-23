import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: ApiModule
})
export class QuestionnairesApiService extends BaseApiService<QuestionnaireModel>{
  endpoint = `/api/v1/questionnaires/`;
  model = QuestionnaireModel;

  getQuestionnaires(): Observable<QuestionnaireModel[]> {
    return this.httpClient.get(`${this.endpoint}load_or_create/`)
      .pipe(
        map((models) => {
          if (!Array.isArray(models)) {
            return [];
          }

          return models.map(model => {
            return new this.model(model);
          });
        })
      );
  }

  updateInputs(questionnaireId: number, inputs: Record<string, string>) {
    return this.httpClient.patch(`${this.endpoint}${questionnaireId}/update_inputs/`, inputs)
      .pipe(
        map((model) => {
          return new this.model(model);
        })
      );
  }
}
