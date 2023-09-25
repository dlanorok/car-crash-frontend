import { Component, OnInit } from '@angular/core';
import { take, tap } from "rxjs";
import { Router } from "@angular/router";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { UrlParamService } from "@app/shared/services/url-param-service";
import { WebSocketService } from "@app/shared/services/web-socket.service";
import { SwUpdate } from "@angular/service-worker";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-join-crash',
  templateUrl: './join-crash.component.html',
  styleUrls: ['./join-crash.component.scss']
})
export class JoinCrashComponent implements OnInit {
  constructor(
    private urlParamService: UrlParamService,
    private router: Router,
    private webSocketService: WebSocketService,
    private swUpdate: SwUpdate,
    private questionnaireService: QuestionnaireService,
    private cookieService: CookieService
  ) {
  }

  ngOnInit() {
    return this.questionnaireService.getOrFetchQuestionnaires().pipe(
      tap(questionnaires => {
        const myQuestionnaire = questionnaires.find(q => q.creator === this.cookieService.get(CookieName.sessionId));
        if (myQuestionnaire) {
          this.router.navigate([`/crash/${localStorage.getItem(StorageItem.sessionId)}/questionnaires/${myQuestionnaire.id}/sections/${myQuestionnaire.data.sections[0].id}/steps/${myQuestionnaire.data.sections[0].starting_step}`]);
        }
      }),
      take(1)
    ).subscribe();
  }
}
