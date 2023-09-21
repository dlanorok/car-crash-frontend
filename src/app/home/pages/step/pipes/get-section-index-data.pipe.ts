import { Pipe, PipeTransform } from '@angular/core';
import { Section } from "@app/home/pages/crash/flow.definition";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { SectionData } from "@app/shared/components/headers/navigation-header/navigation-header.component";

@Pipe({
  name: 'getSectionIndexData',
})
export class GetSectionIndexDataPipe implements PipeTransform {

  transform(section: Section, questionnaire: QuestionnaireModel): SectionData {
    return {
      currentSectionIndex: questionnaire.data.sections.map(section => section.id).indexOf(section.id) + 1,
      sectionsLength: questionnaire.data.sections.length
    };
  }
}
