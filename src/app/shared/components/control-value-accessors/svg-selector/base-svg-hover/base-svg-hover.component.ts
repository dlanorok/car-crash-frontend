import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import { combineLatest, Observable, ReplaySubject, Subscription, tap } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import {
  BaseFormControlComponent
} from "@app/shared/form-controls/base-form-control.component";
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { map } from "rxjs/operators";
import { UploadedFile } from "@app/shared/common/uploaded-file";
import { ValidatorsErrors } from "@app/shared/components/forms/common/enumerators/validators-errors";

export interface BaseSvgData {
  selectedParts: string[];
  file_ids: number[],
  file_id?: number
}

@Component({
  template: '',
})
export abstract class BaseSvgHoverComponent extends BaseFormControlComponent<BaseSvgData> implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  protected readonly renderer2: Renderer2 = inject(Renderer2);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly filesApiService: FilesApiService = inject(FilesApiService);

  protected selectedClass = 'selected';

  @ViewChild('svgImage') svgImage?: ElementRef<SVGElement>;

  private readonly viewInit$: ReplaySubject<void> = new ReplaySubject<void>(1);
  private readonly change$: ReplaySubject<void> = new ReplaySubject<void>(1);

  private viewInitSub?: Subscription;

  protected listeners: (() => void)[] = [];
  protected selectedParts: string[] = [];
  protected file_ids: number[] = [];
  protected file_id?: number;

  abstract onViewReady(): void;

  abstract addListeners(): void;

  abstract saveFile(): Observable<{ id: number | null }>;

  ngAfterViewInit(): void {
    this.viewInit$.next();
  }

  ngOnChanges(): void {
    this.change$.next();
  }

  ngOnDestroy(): void {
    this.viewInitSub?.unsubscribe();
    this.listeners.forEach(listener => listener());
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.formControl.setValidators((control) => {
      const value: BaseSvgData | null = control.value;
      if (!value || !value.selectedParts || value.selectedParts.length === 0) {
        return {
          [ValidatorsErrors.required]: true
        };
      }

      return null;
    });

    this.viewInitSub = combineLatest([this.viewInit$, this.change$])
      .pipe(
        tap(() => {
          this.onViewReady();
          if (this.listeners.length === 0) {
            this.addListeners();
          }
        })
      ).subscribe();
  }

  afterSvgItemClicked(): void {
    this.handleModelChange({
      file_ids: this.file_ids,
      selectedParts: this.selectedParts,
      file_id: this.file_id
    });
  }

  onFileUpload(file: UploadedFile) {
    this.file_ids.push(file.id);
    this.handleModelChange({
      file_ids: this.file_ids,
      selectedParts: this.selectedParts,
      file_id: this.file_id
    });
  }

  onFileDelete(file_id: number) {
    this.file_ids = this.file_ids.filter(_file_id => _file_id !== file_id);
    this.handleModelChange({
      file_ids: this.file_ids,
      selectedParts: this.selectedParts,
      file_id: this.file_id
    });
  }

  beforeSubmit(): Observable<boolean> {
    return this.saveFile().pipe(tap((response) => {
        if (response.id) {
          this.handleModelChange({
            file_ids: this.file_ids,
            selectedParts: this.selectedParts,
            file_id: response.id
          });
        }
      }),
      map(() => true)
    );
  }

  protected onPathClick(event: PointerEvent) {
    if (this.isDisabled$.getValue() === true) {
      return;
    }

    const clickedElement = event.currentTarget as HTMLElement;

    if (clickedElement.classList.contains(this.selectedClass)) {
      clickedElement.classList.remove(this.selectedClass);
      this.selectedParts.splice(this.selectedParts.indexOf(clickedElement.id), 1);
    } else {
      clickedElement.classList.add(this.selectedClass);
      this.selectedParts = [...this.selectedParts, clickedElement.id];
    }
    this.afterSvgItemClicked();
  }

}
