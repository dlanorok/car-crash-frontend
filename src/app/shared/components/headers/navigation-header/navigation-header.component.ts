import { Component, inject, Input } from '@angular/core';
import { CrashModel } from "@app/shared/models/crash.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { Observable, publishReplay, refCount, startWith, switchMap } from "rxjs";
import { Section } from "@app/home/pages/crash/flow.definition";

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
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  @Input() section!: Section;
  @Input() sectionData: SectionData = {currentSectionIndex: 2, sectionsLength: 7};
  @Input() stepData: StepData = {currentStepIndex: 2, stepsLength: 12};
  @Input() crash?: CrashModel | null;

  menuOpened = false;
  selectedCar = 0;

  questionnaires$: Observable<QuestionnaireModel[]> = this.questionnaireService.getOrFetchQuestionnaires().pipe(
    switchMap((questionnaires) => {
      return this.questionnaireService.questionnairesUpdates$.pipe(startWith(questionnaires));
    }),
    publishReplay(1),
    refCount()
  );

  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }
}
