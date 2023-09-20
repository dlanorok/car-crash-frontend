import { Component, Input } from '@angular/core';
import { CrashModel } from "@app/shared/models/crash.model";

export interface SectionData {
  currentSectionIndex: number;
  sectionsLength: number
}

export interface StepData {
  currentStepIndex: number;
  stepsLength: number
}

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent {

  @Input() sectionName!: string;
  @Input() sectionData: SectionData = {currentSectionIndex: 2, sectionsLength: 7};
  @Input() stepData: StepData = {currentStepIndex: 2, stepsLength: 12};
  @Input() crash?: CrashModel | null;

}
