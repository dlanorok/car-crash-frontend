import { Injectable, OnDestroy } from "@angular/core";
import { FooterButton } from "@app/shared/components/footer-buttons/footer-buttons.component";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PageDataService implements OnDestroy {
  page$: ReplaySubject<PageData> = new ReplaySubject<PageData>(1);

  set pageData(pageData: PageData) {
    setTimeout(() => {
      this.page$.next(pageData);
    });
  }

  ngOnDestroy() {
    this.page$.complete();
  }
}

export interface PageData {
  pageName: string;
  pageName$?: Observable<string>;
  footerButtons?: FooterButton[];
}
