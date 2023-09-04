import { Component, inject } from '@angular/core';
import { PageDataService } from "@app/shared/services/page-data.service";
import { Observable, startWith } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent {
  private readonly pageDataService: PageDataService = inject(PageDataService);

  header$: Observable<string> = this.pageDataService.page$.pipe(
    map((pageData) => pageData.pageName),
    startWith(''),
  );
}
