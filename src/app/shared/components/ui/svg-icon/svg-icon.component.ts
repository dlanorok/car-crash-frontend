import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-comp',
  templateUrl: './svg-icon.component.html',
  styles: [':host {display: block; line-height: 0;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent implements OnInit {
  @Input() name?: string;
  @Input() width = '100%';
  @Input() height!: string;

  ngOnInit() {
    if (typeof this.height === 'undefined') {
      this.height = this.width;
    }
  }
}
