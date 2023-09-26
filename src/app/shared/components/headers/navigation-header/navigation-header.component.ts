import { Component, inject, Input, OnDestroy } from '@angular/core';
import { CrashModel } from "@app/shared/models/crash.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import {
  BehaviorSubject,
  filter,
  merge,
  Observable,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  timer
} from "rxjs";
import { Section } from "@app/home/pages/crash/flow.definition";
import { CookieService } from "ngx-cookie-service";
import { map } from "rxjs/operators";
import { CookieName } from "@app/shared/common/enumerators/cookies";

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
export class NavigationHeaderComponent implements OnDestroy {
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  private readonly cookieService: CookieService = inject(CookieService);

  @Input() section!: Section;
  @Input() sectionData: SectionData = {currentSectionIndex: 2, sectionsLength: 7};
  @Input() stepData: StepData = {currentStepIndex: 2, stepsLength: 12};
  @Input() crash?: CrashModel | null;

  private readonly menuOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  menuOpened = false;
  selectedCar = 0;

  questionnaires$: Observable<QuestionnaireModel[]> = merge(
    this.questionnaireService.questionnaireUpdates$,
    this.menuOpened$.pipe(filter(opened => opened)),
    timer(0, 10000).pipe(filter(() => this.menuOpened))
  ).pipe(
    filter(() => this.menuOpened),
    startWith(undefined),
    switchMap(() => {
      return this.questionnaireService.getOrFetchQuestionnaires(true);
    }),
    map((questionnaires) => {
      return questionnaires.sort((a, b) => a.creator === this.cookieService.get(CookieName.sessionId) ? -1 : 1);
    }),
    publishReplay(1),
    refCount()
  );

  toggleMenu() {
    this.menuOpened = !this.menuOpened;
    this.menuOpened$.next(this.menuOpened);
  }

  ngOnDestroy() {
    this.menuOpened$.complete();
  }
}
