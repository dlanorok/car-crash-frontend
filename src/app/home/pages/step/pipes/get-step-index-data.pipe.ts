import { Pipe, PipeTransform } from '@angular/core';
import { Section, Step } from "@app/home/pages/crash/flow.definition";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { StepData } from "@app/shared/components/headers/navigation-header/navigation-header.component";
import { getNextStep } from "@app/shared/common/utils/get-next-step";

@Pipe({
  name: 'getStepIndexData',
})
export class GetStepIndexDataPipe implements PipeTransform {

  transform(step: Step, questionnaire: QuestionnaireModel, section: Section): StepData {
    const startingStep = questionnaire.data.steps.find(step => step.step_type === section.starting_step);
    if (!startingStep) {
      return {
        currentStepIndex: 0,
        stepsLength: 0
      };
    }

    const steps = getNextStep(questionnaire, startingStep, []);
    return {
      currentStepIndex: steps.map(step => step.step_type).indexOf(step.step_type) + 1,
      stepsLength: steps.length
    };
  }
}
