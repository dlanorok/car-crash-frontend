import { Pipe, PipeTransform } from '@angular/core';
import { Section } from "@app/home/pages/crash/flow.definition";
import { ModelState } from "@app/shared/models/base.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { getStateFromSection } from "@app/shared/common/pipes/get-state-from-section/state-from-section";

@Pipe({
  name: 'getStateFromPipe',
})
export class GetStateFromSectionPipe implements PipeTransform {

  transform(questionnaire: QuestionnaireModel, section: Section): ModelState {
    return getStateFromSection(questionnaire, section);
  }
}
