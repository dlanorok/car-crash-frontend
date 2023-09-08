import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-google-maps-button',
  templateUrl: './google-maps-button.component.html',
  styleUrls: ['./google-maps-button.component.scss']
})
export class GoogleMapsButtonComponent {
  @Input() buttonText?: string;
  @Input() icon?: string;
}
