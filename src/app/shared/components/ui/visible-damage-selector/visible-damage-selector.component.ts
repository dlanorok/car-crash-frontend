import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";

@Component({
  selector: 'app-visible-damage-selector',
  templateUrl: './visible-damage-selector.component.html',
  styleUrls: ['./visible-damage-selector.component.scss']
})
export class VisibleDamageSelectorComponent extends BaseSvgHoverComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {

  override onViewReady() {
    this.selectedParts = this.value || [];
    this.svgImage?.nativeElement.querySelectorAll('path').forEach((path) => {
      if (this.value?.includes(path.id)) {
        path.classList.add(this.selectedClass);
      } else {
        path.classList.remove(this.selectedClass);
      }
    });
  }

  override addListeners() {
    this.svgImage?.nativeElement.querySelectorAll('path').forEach((path) => {
      this.listeners.push(this.renderer2.listen(path, 'click', this.onPathClick.bind(this)));
    });
  }

}
