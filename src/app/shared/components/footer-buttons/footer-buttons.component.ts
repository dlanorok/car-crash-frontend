import { Component, Input } from '@angular/core';
import { Observable } from "rxjs";

@Component({
  selector: 'app-footer-buttons',
  templateUrl: './footer-buttons.component.html',
  styleUrls: ['./footer-buttons.component.scss']
})
export class FooterButtonsComponent {
  @Input() buttons: FooterButton[] = [];
}


export interface FooterButton {
  name$: Observable<string>;
  action: () => void;
  icon: string;
}
