import { Component } from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { provideControlValueAccessor } from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-point-of-initial-impact',
  templateUrl: './point-of-initial-impact.component.html',
  styleUrls: ['./point-of-initial-impact.component.scss'],
  providers: [provideControlValueAccessor(PointOfInitialImpactComponent)],
})
export class PointOfInitialImpactComponent extends BaseSvgHoverComponent {

  override onViewReady() {
    this.value$.subscribe((value) => {
      this.selectedParts = value || [];
      this.svgImage?.nativeElement.querySelectorAll('g').forEach((path) => {
        if (this.selectedParts?.includes(path.id)) {
          path.classList.add(this.selectedClass);
        } else {
          path.classList.remove(this.selectedClass);
        }
      });
    });
  }

  override addListeners() {
    this.svgImage?.nativeElement.querySelectorAll('g').forEach((path) => {
      this.listeners.push(this.renderer2.listen(path, 'click', this.onPathClick.bind(this)));
    });
  }

}
