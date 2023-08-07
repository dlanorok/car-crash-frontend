import { Pipe, PipeTransform } from '@angular/core';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { StepType } from "@app/home/pages/crash/flow.definition";

@Pipe({
  name: 'carIdentifier',
})
export class CarIdentifierPipe implements PipeTransform {

  transform(questionnaire: QuestionnaireModel, questionnaireIndex: number): string {
    const step = questionnaire.data.steps.find(step => step.step_type === StepType.registration_number);
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');

    if (!step) {
      return `§§Car ${alphabet[questionnaireIndex]}`;
    }

    const inputs = questionnaire.data.inputs.filter(input => step.inputs.includes(input.id));
    const values = inputs.map(input => input.value);
    if (values.length === 0 || values.filter(value => value !== null).length === 0) {
      return `§§Car ${alphabet[questionnaireIndex]}`;
    }
    return `§§Car ${values.join(" - ")}`;
  }
}
