import { Component, OnInit } from '@angular/core';
import { HeaderService } from "../../../shared/services/header-service";

@Component({
  selector: 'app-join-crash',
  templateUrl: './join-crash.component.html',
  styleUrls: ['./join-crash.component.scss']
})
export class JoinCrashComponent implements OnInit {
  constructor(
    private readonly headerService: HeaderService
  ) {
  }

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Join other participant'});
  }
}
