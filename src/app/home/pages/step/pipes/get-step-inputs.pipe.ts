import { Pipe, PipeTransform } from '@angular/core';
import { Input, InputType, Step } from "@app/home/pages/crash/flow.definition";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

@Pipe({
  name: 'getStepInputs',
})
export class GetStepInputsPipe implements PipeTransform {

  transform(step: Step, questionnaire: QuestionnaireModel): Input[] {
    return step.inputs.reduce((acc: Input[], inputId) => {
      const input = questionnaire.data.inputs[inputId];
      if (input.type === InputType.date || input.type === InputType.dateTime) {
        if (input.value) {
          input.value = new Date(input.value);
        } else {
          input.value = new Date();
        }
      }
      acc.push(input);
      return acc;
    }, []);
  }
}
