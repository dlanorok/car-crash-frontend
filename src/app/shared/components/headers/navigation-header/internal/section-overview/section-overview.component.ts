import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Section, SectionId } from '@app/home/pages/crash/flow.definition';
import { ModelState } from '@app/shared/models/base.model';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { CrashModel } from "@app/shared/models/crash.model";
import { Router } from "@angular/router";
import { AreAllCompletedPipe } from "@app/shared/common/pipes/are-all-completed/are-all-completed.pipe";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";

@Component({
  selector: 'app-section-overview',
  templateUrl: './section-overview.component.html',
  styleUrls: ['./section-overview.component.scss'],
  providers: [AreAllCompletedPipe]
})
export class SectionOverviewComponent {
  private readonly router: Router = inject(Router);
  private readonly areAllCompletedPipe: AreAllCompletedPipe = inject(AreAllCompletedPipe);
  private readonly cookieService: CookieService = inject(CookieService);

  @Input() questionnaire!: QuestionnaireModel;
  @Input() questionnaires: QuestionnaireModel[] = [];
  @Input() crash!: CrashModel;
  @Input() currentSection!: Section;

  @Output() sectionClicked: EventEmitter<void> = new EventEmitter<void>();

  readonly SectionId: typeof SectionId = SectionId;
  readonly ModelState: typeof ModelState = ModelState;

  handleSectionClicked(url: string, section: Section) {
    if (section.id === this.SectionId.confirmation && !this.areAllCompletedPipe.transform(this.questionnaires)) {
      return;
    }

    if (this.questionnaire.creator !== this.cookieService.get(CookieName.sessionId)) {
      return;
    }

    this.router.navigateByUrl(url);
    this.sectionClicked.next();
  }


}
