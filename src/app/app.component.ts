import { Component, OnInit } from '@angular/core';
import { UrlParamService } from "./shared/services/url-param-service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, tap } from "rxjs";
import { defineComponents } from "@regulaforensics/vp-frontend-document-components";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'car-crash-frontend';

  constructor(
    private urlParamService: UrlParamService,
    private router: Router
  ) { }

  ngOnInit(): void {
    defineComponents();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => this.urlParamService.saveUrlParamToLocalStorage('session_id', 'crash'))
    ).subscribe();
  }
}
