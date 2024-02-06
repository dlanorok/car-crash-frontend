import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Step } from "@app/home/pages/crash/flow.definition";

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent {
  @Input() step?: Step;
  @Input() nextButtonName?: string;
  @Input() errorText?: string;
  @Input() inputSectionTpl?: TemplateRef<void>;
  @Input() showBack = true;
  @Input() loadingButton?: boolean;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
}
