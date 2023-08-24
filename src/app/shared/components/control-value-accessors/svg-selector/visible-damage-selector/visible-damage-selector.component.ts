import { Component } from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { provideControlValueAccessor } from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-visible-damage-selector',
  templateUrl: './visible-damage-selector.component.html',
  styleUrls: ['./visible-damage-selector.component.scss'],
  providers: [provideControlValueAccessor(VisibleDamageSelectorComponent)],
})
export class VisibleDamageSelectorComponent extends BaseSvgHoverComponent {

  override onViewReady() {
    this.value$.subscribe((value) => {
      this.selectedParts = value?.selectedParts || [];
      this.file_ids = value?.file_ids || [];
      this.svgImage?.nativeElement.querySelectorAll('path').forEach((path) => {
        if (this.selectedParts?.includes(path.id)) {
          path.classList.add(this.selectedClass);
        } else {
          path.classList.remove(this.selectedClass);
        }
      });
    });
  }

  override addListeners() {
    this.svgImage?.nativeElement.querySelectorAll('path').forEach((path) => {
      this.listeners.push(this.renderer2.listen(path, 'click', this.onPathClick.bind(this)));
    });
  }

}
