import { Pipe, PipeTransform } from '@angular/core';
import { Input, Step } from "@app/home/pages/crash/flow.definition";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

@Pipe({
  name: 'getStepInputs',
})
export class GetStepInputsPipe implements PipeTransform {

  transform(step: Step, questionnaire: QuestionnaireModel): Input[] {
    return questionnaire.data.inputs.filter(input => step.input === input.id);
  }
}
