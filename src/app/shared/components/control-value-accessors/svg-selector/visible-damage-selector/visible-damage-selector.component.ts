import { Component, OnInit } from '@angular/core';
import { BaseSvgHoverComponent } from "../base-svg-hover/base-svg-hover.component";
import { provideControlValueAccessor } from "@app/shared/form-controls/base-form-control.component";
import { Observable, of, take, tap } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-visible-damage-selector',
  templateUrl: './visible-damage-selector.component.html',
  styleUrls: ['./visible-damage-selector.component.scss'],
  providers: [provideControlValueAccessor(VisibleDamageSelectorComponent)],
})
export class VisibleDamageSelectorComponent extends BaseSvgHoverComponent implements OnInit {
  step = 0;

  ngOnInit(): void {
    super.ngOnInit();
    // this.formControl.addValidators((control) => {
    //   const value: BaseSvgData | null = control.value;
    //   if ((!value || !value.file_ids || value.file_ids.length === 0) && this.step === 1) {
    //     return {
    //       [ValidatorsErrors.required]: true
    //     };
    //   }
    //
    //   return null;
    // });
  }

  override onViewReady() {
    this.value$.subscribe((value) => {
      this.selectedParts = value?.selectedParts || [];
      this.file_ids = value?.file_ids || [];
      this.file_id = value?.file_id;
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

  saveFile(): Observable<{id: number | null}> {
    const element = this.svgImage?.nativeElement.cloneNode(true) as HTMLElement;

    if (element) {
      element.querySelectorAll("path").forEach(g => g.setAttribute("style", "fill: #9D9BA0FF;"));
      element.querySelectorAll("path.selected").forEach(path => path.setAttribute("style", "fill: #dc3545;"));

      const blob = new Blob([element.outerHTML]);
      return this.filesApiService.uploadFile(new File([blob], 'visible-damage.svg')).pipe(take(1));
    }

    return of({id: null});
  }

  beforeSubmit(): Observable<boolean> {
    return super.beforeSubmit().pipe(
      map(() => {
        return this.step > 0;
      }),
      tap(() => {
        if (this.step === 0) {
          this.step += 1;
        }
      })
    );
  }

  beforeBack(): Observable<boolean> {
    return of(undefined).pipe(
      map(() => this.step < 1),
      tap(() => {
        if (this.step > 0) {
          this.step -= 1;
        }
      })
    );
  }
}
