import { Pipe, PipeTransform } from '@angular/core';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

@Pipe({
  name: 'areAllCompleted',
})
export class AreAllCompletedPipe implements PipeTransform {

  transform(questionnaires?: QuestionnaireModel[]): boolean {
    if (!questionnaires || questionnaires.length === 0) {
      return false;
    }

    return questionnaires.reduce((acc: boolean, questionnaire: QuestionnaireModel) => {
      acc = acc && !!questionnaire.completed;
      return acc;
    }, true);
  }
}
