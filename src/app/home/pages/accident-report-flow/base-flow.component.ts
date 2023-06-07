import { Component, ViewChild } from "@angular/core";
import { BaseFormComponent } from "@app/shared/components/forms/base-form.component";
import { Subscription, tap } from "rxjs";
import { BaseModel } from "@app/shared/models/base.model";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";

@Component({
  template: '',
})
export abstract class BaseFlowComponent<T, C extends BaseModel> extends BaseFooterComponent {

  @ViewChild('formComponent', {static: false}) protected formComponent?: BaseFormComponent<C>;

  @ViewChild('formComponent')
  set setCircumstanceForm(formComponent: BaseFormComponent<T>) {
    if (formComponent) {
      this.setFormsData();
      this.subscribeToFormChange();
      this.subscribeAfterFormSubmit();
    }
  }

  formChangeSubscription?: Subscription;
  baseModel!: C;
  showOCRComponent = false;

  constructor(
    protected readonly router: Router,
    protected readonly translateService: TranslocoService
  ) {
    super(router, translateService);
  }

  protected abstract setFormsData(): void;
  protected abstract saveForm(model: C, validate: boolean): void;

  private subscribeToFormChange(): void {
    this.formChangeSubscription?.unsubscribe();
    this.formChangeSubscription = this.formComponent?.formChange
      .pipe(
        tap((model: C) => {
          this.saveForm(model, false);
        })
      ).subscribe();
  }

  private subscribeAfterFormSubmit(): void {
    this.formComponent?.formSubmit
      .pipe(
        tap((model: C) => {
          this.saveForm(model, true);
        })
      ).subscribe();
  }

  next(): void {
    this.submit();
  }

  submit(): void {
    this.formComponent?.submitForm();
  }

  processOCRResponse(response: Response) {
    this.formComponent?.setFromOCRResponse(response);
    this.showOCRComponent = false;
  }

}
