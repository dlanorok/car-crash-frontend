import { Component, OnInit } from '@angular/core';
import { BaseSvgData, BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { provideControlValueAccessor } from "@app/shared/form-controls/base-form-control.component";
import { ValidatorsErrors } from "@app/shared/components/forms/common/enumerators/validators-errors";

@Component({
  selector: 'app-point-of-initial-impact',
  templateUrl: './point-of-initial-impact.component.html',
  styleUrls: ['./point-of-initial-impact.component.scss'],
  providers: [provideControlValueAccessor(PointOfInitialImpactComponent)],
})
export class PointOfInitialImpactComponent extends BaseSvgHoverComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    this.formControl.setValidators((control) => {
      const value: BaseSvgData | null = control.value;
      if (!value || !value.selectedParts && !value.file_ids) {
        return {
          [ValidatorsErrors.required]: true
        };
      }

      if (value.selectedParts.length === 0 || value.file_ids.length === 0) {
        return {
          [ValidatorsErrors.required]: true
        };
      }

      return null;
    });
  }

  override onViewReady() {
    this.value$.subscribe((value) => {
      this.selectedParts = value?.selectedParts || [];
      this.file_ids = value?.file_ids || [];
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
