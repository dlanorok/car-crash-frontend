import { Component } from '@angular/core';
import { HeaderService } from "../../services/header-service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  constructor(private readonly headerService: HeaderService) {}


  get headerTitle(): string | undefined {
    return this.headerService.header;
  }
}
