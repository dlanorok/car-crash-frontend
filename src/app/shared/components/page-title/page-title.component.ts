import { Component, Input } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() title!: string;
  @Input() onBackClick?: () => void;

  constructor(private readonly location: Location)
  {}

  back(): void {
    if (this.onBackClick) {
      this.onBackClick()
      return;
    }

    this.location.back();
  }

}
