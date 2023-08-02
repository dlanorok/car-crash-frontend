import { Component } from '@angular/core';
import { HeaderService } from "../../services/header-service";

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent {
  pageTitle = '';

  constructor(
    private readonly headerService: HeaderService
  ) {}

  get headerTitle(): string | undefined {
    return this.headerService.header;
  }

  navigateBack() {
    this.headerService.navigateToPrevious();
  }
}
