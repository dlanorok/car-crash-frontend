import { Pipe, PipeTransform } from '@angular/core';
import { Action, Input, Section, Step } from "@app/home/pages/crash/flow.definition";
import { ModelState } from "@app/shared/models/base.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

@Pipe({
  name: 'getStateFromPipe',
})
export class GetStateFromSectionPipe implements PipeTransform {

  transform(section: Section, questionnaire: QuestionnaireModel): ModelState {
    const startingStep = questionnaire.data.steps.find(step => step.step_type === section.starting_step);
    if (!startingStep) {
      return ModelState.empty;
    }

    const steps = this.getNextStep(questionnaire, startingStep, []);
    const inputIds: number[] = steps.map((step => step.input));
    const inputs = questionnaire.data.inputs.filter((input) => input.required && inputIds.includes(input.id));

    const completedInputs = inputs.reduce((acc: number, currInput: Input) => {
      if (currInput.value !== null) {
        acc += 1;
      }
      return acc;
    }, 0);


    return inputIds.length === completedInputs ? ModelState.validated : completedInputs === 0 ? ModelState.empty : ModelState.partial;
  }

  private getNextStep(questionnaire: QuestionnaireModel, step: Step, value: Step[]): Step[] {
    value.push(step);
    if (step.next_step) {
      const nextStep = questionnaire.data.steps.find(_step => _step.step_type === step.next_step);
      if (!nextStep) {
        return value;
      }
      this.getNextStep(questionnaire, nextStep, value);
    }

    const input = questionnaire.data.inputs.find(_input => _input.id === step.input);
    const optionSelected = input?.options?.find(option => option.value === input?.value);
    if (input && optionSelected && optionSelected.action === Action.nextStep && optionSelected.action_property?.step) {
      const nextStep = questionnaire.data.steps.find(_step => _step.step_type === optionSelected.action_property?.step);
      if (nextStep) {
        this.getNextStep(questionnaire, nextStep, value);
      }
    }

    return value;
  }
}
