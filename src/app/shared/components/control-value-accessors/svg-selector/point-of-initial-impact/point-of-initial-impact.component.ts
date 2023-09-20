import { Component } from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { provideControlValueAccessor } from "@app/shared/form-controls/base-form-control.component";
import { Observable, of, take } from "rxjs";

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
      element.querySelectorAll("path").forEach(g => g.setAttribute("style", "fill: transparent; stroke: #9D9BA0FF;"));

      element.querySelectorAll("line").forEach(line => line.setAttribute("style", "stroke-width: 3px; stroke: #9D9BA0FF"));
      element.querySelectorAll("polygon").forEach(line => line.setAttribute("style", "stroke-width: 3px; fill: #9D9BA0FF"));
      element.querySelectorAll("g.selected").forEach(g => g.querySelectorAll("line").forEach(
        line => line.setAttribute("style", "stroke: #dc3545; stroke-width: 3px;"))
      );
      element.querySelectorAll("g.selected").forEach(g => g.querySelectorAll("polygon").forEach(
        polygon => polygon.setAttribute("style", "fill: #dc3545;"))
      );

      const blob = new Blob([element.outerHTML]);
      return this.filesApiService.uploadFile(new File([blob], 'initial-impact.svg')).pipe(take(1));
    }

    return of({id: null});
  }

}
