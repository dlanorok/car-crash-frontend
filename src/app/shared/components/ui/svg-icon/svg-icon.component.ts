import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-comp',
  templateUrl: './svg-icon.component.html',
  styles: [':host {display: block;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent {
  @Input() src: {default: string} | undefined;
}
