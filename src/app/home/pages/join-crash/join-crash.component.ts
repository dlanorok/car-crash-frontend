import { Component, OnInit } from '@angular/core';
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-join-crash',
  templateUrl: './join-crash.component.html',
  styleUrls: ['./join-crash.component.scss']
})
export class JoinCrashComponent implements OnInit {
  constructor(
    private readonly pageDataService: PageDataService
  ) {
  }

  ngOnInit() {
    this.pageDataService.pageData = {pageName: '§§Join other participant'};
  }
}
