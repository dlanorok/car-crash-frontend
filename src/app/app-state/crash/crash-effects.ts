import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { CrashesApiService } from "../../shared/api/crashes/crashes-api.service";
import { createCrash, loadCrash, loadCrashSuccessful, updateCrash } from "./crash-action";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectCrash } from "./crash-selector";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { StorageItem } from "@app/shared/common/enumerators/storage";

@Injectable()
export class CrashEffects {

  loadCrashes$ = createEffect(() => this.actions$.pipe(
      ofType(loadCrash),
      withLatestFrom(this.store.select(selectCrash)),
      filter(([action, crash]) => !crash.id),
      exhaustMap(([action, crash]) => this.crashesApiService.getSingle(action.sessionId)
        .pipe(
          map(crash => ({type: loadCrashSuccessful.type, crash})),
          catchError(() => EMPTY)
        ))
    )
  );

  updateCrash$ = createEffect(() => this.actions$.pipe(
      ofType(updateCrash),
      withLatestFrom(this.store.select(selectCrash)),
      exhaustMap(([action, crash]) => this.crashesApiService.put({
        ...crash,
        ...action.crash
      })
        .pipe(
          map(crash => ({type: loadCrashSuccessful.type, crash})),
          catchError(() => EMPTY)
        ))
    )
  );

  createCrash$ = createEffect(() => this.actions$.pipe(
      ofType(createCrash),
      exhaustMap((action) => this.crashesApiService.create(action.crash)
        .pipe(
          switchMap((crash) => {
            localStorage.setItem(StorageItem.sessionId, crash.session_id);
            return this.questionnaireService.fetchQuestionnaires().pipe(
              map((questionnaires) => {
                return questionnaires.find(q => q.creator === this.cookieService.get(CookieName.sessionId));
              }),
              tap((questionnaire?: QuestionnaireModel) => {
                if (questionnaire) {
                  const section = questionnaire.data.sections[0];
                  this.router.navigate([`/crash/${crash.session_id}/questionnaires/${questionnaire.id}/sections/${section.id}/steps/${section.starting_step}`]);
                }
              }),
              map(() => crash)
            );
          }),
          map(crash => ({type: loadCrashSuccessful.type, crash})),
          catchError(() => EMPTY)
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private crashesApiService: CrashesApiService,
    private questionnaireService: QuestionnaireService,
    private cookieService: CookieService,
    private router: Router,
    private store: Store,

  ) {
  }
}
