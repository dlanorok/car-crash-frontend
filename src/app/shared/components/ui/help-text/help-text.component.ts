import { Component, Input } from '@angular/core';
import { Step } from "@app/home/pages/crash/flow.definition";

@Component({
  selector: 'app-help-text',
  templateUrl: './help-text.component.html',
  styleUrls: ['./help-text.component.scss']
})
export class HelpTextComponent {
  @Input() step?: Step;
}
