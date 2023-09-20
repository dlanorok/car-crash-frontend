import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Step } from "@app/home/pages/crash/flow.definition";

export function getNextStep(questionnaire: QuestionnaireModel, step: Step, value: Step[]): Step[] {
  value.push(step);
  if (step.next_step) {
    const nextStep = questionnaire.data.steps.find(_step => _step.step_type === step.next_step);
    if (!nextStep) {
      return value;
    }
    getNextStep(questionnaire, nextStep, value);
  }

  const input = questionnaire.data.inputs[step.inputs[0]];
  const optionSelected = input?.options?.find(option => option.value === input?.value);
  if (input && optionSelected && optionSelected.action_property?.step) {
    const nextStep = questionnaire.data.steps.find(_step => _step.step_type === optionSelected.action_property?.step);
    if (nextStep) {
      getNextStep(questionnaire, nextStep, value);
    }
  }

  return value;
}
