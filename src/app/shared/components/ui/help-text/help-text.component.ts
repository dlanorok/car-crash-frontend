import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-text',
  templateUrl: './help-text.component.html',
  styleUrls: ['./help-text.component.scss']
})
export class HelpTextComponent {
  @Input() infoText?: string;
}
