import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, take } from "rxjs";
import { Store } from "@ngrx/store";
import { HeaderService } from "@app/shared/services/header-service";
import { ModelState } from "@app/shared/models/base.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { SectionId } from './flow.definition';

@UntilDestroy()
@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  readonly ModelState = ModelState;
  questionnaires: QuestionnaireModel[] = [];
  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  readonly SectionId: typeof SectionId = SectionId;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly questionnaireService: QuestionnaireService,
    private readonly cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    this.headerService.setHeaderData({name: '§§Accident statement'});
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId}));

    this.questionnaireService.getOrFetchQuestionnaires().pipe(
      take(1)
    ).subscribe((questionnaires) => {
      this.questionnaires = questionnaires.sort((q1, q2) => {
        return q1.creator === this.cookieService.get(CookieName.sessionId) ? -1 : 1;
      });
    });
    this.subscribeToQuestionnaireChange();
  }

  private subscribeToQuestionnaireChange() {
    this.questionnaireService.questionnairesUpdates$.pipe(
      untilDestroyed(this)
    ).subscribe((questionnaires) => {
      this.questionnaires = questionnaires;
    });
  }
}
