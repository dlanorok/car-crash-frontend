import { Pipe, PipeTransform } from '@angular/core';
import { Input, InputType, Step } from "@app/home/pages/crash/flow.definition";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

@Pipe({
  name: 'getStepInputs',
})
export class GetStepInputsPipe implements PipeTransform {

  transform(step: Step, questionnaire: QuestionnaireModel): Input[] {
    return questionnaire.data.inputs.filter(input => step.input === input.id).map((input) => {
      if (input.type === InputType.date || input.type === InputType.dateTime) {
        input.value = new Date(input.value);
      }
      return input;
    });
  }
}
