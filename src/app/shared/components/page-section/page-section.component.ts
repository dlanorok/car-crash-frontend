import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from "rxjs";

@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss']
})
export class PageSectionComponent {
  @Input() sectionTitle!: string;
  @Input() buttonText?: string;
  @Output() onButtonClick: EventEmitter<void> = new EventEmitter<void>();
}
