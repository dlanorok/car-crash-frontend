import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section, SectionId } from '@app/home/pages/crash/flow.definition';
import { ModelState } from '@app/shared/models/base.model';
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { CrashModel } from "@app/shared/models/crash.model";

@Component({
  selector: 'app-section-overview',
  templateUrl: './section-overview.component.html',
  styleUrls: ['./section-overview.component.scss']
})
export class SectionOverviewComponent {

  @Input() questionnaire!: QuestionnaireModel;
  @Input() questionnaires: QuestionnaireModel[] = [];
  @Input() crash!: CrashModel;
  @Input() currentSection!: Section;

  @Output() sectionClicked: EventEmitter<void> = new EventEmitter<void>();

  readonly SectionId: typeof SectionId = SectionId;
  readonly ModelState: typeof ModelState = ModelState;


}
