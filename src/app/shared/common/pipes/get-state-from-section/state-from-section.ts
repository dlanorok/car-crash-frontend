import { ModelState } from "@app/shared/models/base.model";
import { Input, Section, SectionId, StepType } from "@app/home/pages/crash/flow.definition";
import { Sketch } from "@app/shared/components/control-value-accessors/sketch-canvas/sketch-canvas.component";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { getNextStep } from "@app/shared/common/utils/get-next-step";

export function getStateFromSection(questionnaire: QuestionnaireModel, section: Section): ModelState {
  const startingStep = questionnaire.data.steps.find(step => step.step_type === section.starting_step);
  if (!startingStep) {
    return ModelState.empty;
  }

  const steps = getNextStep(questionnaire, startingStep, []);

  if (section.id === SectionId.accidentSketch) {
    const step = steps.find(step => step.step_type === StepType.accident_sketch);
    if (!step) {
      return ModelState.empty;
    }

    const inputId = step.inputs[0];
    const input = questionnaire.data.inputs[inputId];
    if (input) {
      const value: Sketch = input.value;
      if (value && value.confirmed_editors?.length > 0) {
        return value.confirmed_editors.includes(questionnaire.creator) ? ModelState.validated : ModelState.partial;
      } else {
        return (value.cars || []).length > 0 && value.cars[0].x ? ModelState.partial : ModelState.empty;
      }
    }
  }


  const inputIds: number[] = steps.reduce((acc: number[], step) => {
    step.inputs.forEach((input: number) => acc.push(input));
    return acc;
  }, []);

  const notRequiredInputs: Input[] = [];
  const inputs = inputIds.reduce((acc: Input[], inputId) => {
    const input = questionnaire.data.inputs[inputId];
    if (input.required) {
      acc.push(input);
    } else {
      notRequiredInputs.push(input);
    }
    return acc;
  }, []);

  const completedInputs = inputs.reduce((acc: number, currInput: Input) => {
    if (currInput.value !== null) {
      acc += 1;
    }
    return acc;
  }, 0);

  const notRequiredCompletedFields = notRequiredInputs.reduce((acc: number, currInput: Input) => {
    if (currInput.value !== null) {
      acc += 1;
    }
    return acc;
  }, 0);

  return ((inputs.length === 0 && notRequiredCompletedFields > 0) || (inputs.length > 0 && inputs.length === completedInputs)) ? ModelState.validated : completedInputs === 0 ? ModelState.empty : ModelState.partial;

}

