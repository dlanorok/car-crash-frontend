import { Component, OnInit } from '@angular/core';
import { UrlParamService } from "./shared/services/url-param-service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, tap } from "rxjs";
import { WebSocketService } from "@app/shared/services/web-socket.service";
import { SwUpdate } from "@angular/service-worker";
import { PageDataService } from "@app/shared/services/page-data.service";
import { FooterButton } from "@app/shared/components/footer-buttons/footer-buttons.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'car-crash-frontend';
  buttons: FooterButton[] = [];

  constructor(
    private urlParamService: UrlParamService,
    private router: Router,
    private webSocketService: WebSocketService,
    private swUpdate: SwUpdate,
    private pageDataService: PageDataService
  ) {
    if (swUpdate.isEnabled) {
      swUpdate.versionUpdates.subscribe(event => {
        console.log(event);
        if (event.type === "VERSION_READY" && confirm('New version available. Refresh')) {
          window.location.reload();
        }
      });
    }
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => this.urlParamService.saveUrlParamToLocalStorage('session_id', 'crash')),
      tap((event) => {
        const currentPage = (event as NavigationEnd).url;
        if (currentPage.includes('/crash')) {
          this.webSocketService.connect();
        } else {
          this.webSocketService.close();
        }
      })
    ).subscribe();

    this.pageDataService.page$.subscribe((data) => {
      this.buttons = data.footerButtons || [];
    });
  }
}
