import { Pipe, PipeTransform } from '@angular/core';
import { Action, Input, Section, SectionId, Step } from "@app/home/pages/crash/flow.definition";
import { ModelState } from "@app/shared/models/base.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Sketch } from "@app/shared/components/control-value-accessors/sketch-canvas/sketch-canvas.component";

@Pipe({
  name: 'getStateFromPipe',
})
export class GetStateFromSectionPipe implements PipeTransform {

  transform(questionnaire: QuestionnaireModel, section: Section): ModelState {
    const startingStep = questionnaire.data.steps.find(step => step.step_type === section.starting_step);
    if (!startingStep) {
      return ModelState.empty;
    }

    if (section.id === SectionId.accidentSketch) {
      const inputId = startingStep.inputs[0];
      const input = questionnaire.data.inputs[inputId];
      if (input) {
        const value: Sketch = input.value;
        if (value && value.confirmed_editors?.length > 0) {
          return value.confirmed_editors.includes(questionnaire.creator) ? ModelState.validated : ModelState.partial;
        } else {
          return (value.cars || []).length > 0 ? ModelState.partial : ModelState.empty;
        }
      }
    }

    const steps = this.getNextStep(questionnaire, startingStep, []);

    const inputIds: number[] = steps.reduce((acc: number[], step) => {
      step.inputs.forEach((input: number) => acc.push(input));
      return acc;
    }, []);

    const inputs = inputIds.reduce((acc: Input[], inputId) => {
      const input = questionnaire.data.inputs[inputId];
      if (input.required) {
        acc.push(input);
      }
      return acc;
    }, []);

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

    const input = questionnaire.data.inputs[step.inputs[0]];
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
