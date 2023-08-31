import { Pipe, PipeTransform } from '@angular/core';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Section } from "@app/home/pages/crash/flow.definition";
import { ModelState } from "@app/shared/models/base.model";
import { getStateFromSection } from "@app/shared/common/pipes/get-state-from-section/state-from-section";

@Pipe({
  name: 'allStepsCompleted',
})
export class AllStepsCompletedPipe implements PipeTransform {

  transform(questionnaire: QuestionnaireModel): boolean {
    return questionnaire.data.sections.reduce((acc: boolean, section: Section) => {
      const state = getStateFromSection(questionnaire, section);
      acc = acc && state === ModelState.validated;
      return acc;
    }, true);
  }
}
