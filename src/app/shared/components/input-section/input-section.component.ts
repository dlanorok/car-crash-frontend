import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-section',
  templateUrl: './input-section.component.html',
  styleUrls: ['./input-section.component.scss']
})
export class InputSectionComponent {
  @Input() disabledButton?: boolean;
  @Input() buttonName!: string;
  @Input() title?: string;
  @Input() info?: string;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();

}
