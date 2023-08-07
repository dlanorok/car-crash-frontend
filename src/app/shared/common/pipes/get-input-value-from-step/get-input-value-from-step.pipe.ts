import { Pipe, PipeTransform } from '@angular/core';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Step } from "@app/home/pages/crash/flow.definition";

@Pipe({
  name: 'getInputValueFromStep',
})
export class GetInputValueFromStepPipe implements PipeTransform {

  transform(step: Step, questionnaire: QuestionnaireModel): string {
    const inputs = questionnaire.data.inputs.filter(input => step.inputs.includes(input.id));
    const values = inputs.map(input => input.value);
    return values.join(" - ");
  }
}
