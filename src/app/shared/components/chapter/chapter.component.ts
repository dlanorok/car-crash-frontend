import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Step } from "@app/home/pages/crash/flow.definition";

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent {
  @Input() step?: Step;
  @Input() nextButtonName?: string;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
}
