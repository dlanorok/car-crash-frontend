import { Component, Input } from '@angular/core';
import { Step } from "@app/home/pages/crash/flow.definition";

@Component({
  selector: 'app-info-section',
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.scss']
})
export class InfoSectionComponent {
  @Input() step?: Step;
  @Input() isSmall?: boolean;
}
