import { Component } from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { provideControlValueAccessor } from "@app/shared/form-controls/base-form-control.component";
import { Observable, of, take } from "rxjs";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { nanoid } from "nanoid";

@Component({
  selector: 'app-point-of-initial-impact',
  templateUrl: './point-of-initial-impact.component.html',
  styleUrls: ['./point-of-initial-impact.component.scss'],
  providers: [provideControlValueAccessor(PointOfInitialImpactComponent)],
})
export class PointOfInitialImpactComponent extends BaseSvgHoverComponent {
  override addClasses(): void {
    this.svgImage?.nativeElement.querySelectorAll('g').forEach((path) => {
      if (this.selectedParts?.includes(path.id)) {
        path.classList.add(this.selectedClass);
      } else {
        path.classList.remove(this.selectedClass);
      }
    });
  }

  override addListeners() {
    this.svgImage?.nativeElement.querySelectorAll('g[id]').forEach((path) => {
      if (path.id === "car") {
        return;
      }

      this.listeners.push(this.renderer2.listen(path, 'click', this.onPathClick.bind(this)));
    });
  }

  saveFile(): Observable<{id: number | null}> {
    const element = this.svgImage?.nativeElement.cloneNode(true) as HTMLElement;

    if (element) {
      element.querySelectorAll("path:not(.cls-4)").forEach(g => g.setAttribute("style", "fill: #9D9BA0FF;"));
      element.querySelectorAll("g.selected").forEach(g => {
        g.querySelectorAll("g.arrow-wrapper .cls-4").forEach(g => g.setAttribute("style", "fill: #dc3545;"));
        g.querySelectorAll("g.arrow-wrapper .cls-2").forEach(g => g.setAttribute("style", "fill: #dc3545;"));
        g.querySelectorAll("g.arrow path").forEach(g => g.setAttribute("style", "fill: #fff;"));
      });

      const blob = new Blob([element.outerHTML]);
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      return this.filesApiService.uploadFile(new File([blob], `initial-impact-${sessionId}-${nanoid()}.svg`)).pipe(take(1));
    }

    return of({id: null});
  }

}
