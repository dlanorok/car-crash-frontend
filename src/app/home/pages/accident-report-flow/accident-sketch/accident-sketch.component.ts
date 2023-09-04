import { Component, inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { Store } from "@ngrx/store";
import { filter, Observable } from "rxjs";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { loadSketches } from "@app/app-state/sketch/sketch-action";
import { SketchModel } from "@app/shared/models/sketch.model";
import { selectSketches } from "@app/app-state/sketch/sketch-selector";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-accident-sketch',
  templateUrl: './accident-sketch.component.html',
  styleUrls: ['./accident-sketch.component.scss']
})
export class AccidentSketchComponent implements OnInit {
  protected readonly pageDataService: PageDataService = inject(PageDataService);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly router: Router = inject(Router);
  protected readonly store: Store = inject(Store);

  sketches$: Observable<SketchModel[]> = this.store.select(selectSketches);

  readonly sketch$: Observable<SketchModel> = this.sketches$.pipe(
    filter((sketches: SketchModel[]) => {
      return !(sketches === null || !Array.isArray(sketches) || sketches.length === 0);
    }),
    map((sketches: SketchModel[]) => {
      if (sketches.length === 1) {
        return sketches[0];
      }

      const mySketch = sketches.find(sketch => sketch.creator === this.cookieService.get(CookieName.sessionId));

      if (mySketch) {
        return mySketch;
      }

      return sketches[0];
    })
  );

  ngOnInit(): void {
    this.pageDataService.pageData = {pageName: '§§Accident sketch'};
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId: sessionId }));
    this.store.dispatch(loadSketches());
  }

}
