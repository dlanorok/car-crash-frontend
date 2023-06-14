import { UntypedFormGroup } from "@angular/forms";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ValidatorsErrors } from "./common/enumerators/validators-errors";
import { debounceTime, distinctUntilChanged, Subscription, tap } from "rxjs";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";

@Component({
  template: '',
})
export abstract class BaseFormComponent<T> implements OnInit, OnDestroy {
  form!: UntypedFormGroup;
  submitted = false;
  hasOcrEnabled = false;
  ocrTitle?: string;

  @Output() formSubmit: EventEmitter<T> = new EventEmitter<T>();
  @Output() formChange: EventEmitter<T> = new EventEmitter<T>();

  formSubscription?: Subscription;

  ngOnInit(): void {
    this.initForm();
    this.subscribeToFormChange();
  }

  protected abstract initForm(): void;
  protected abstract afterFormSubmit(): void;
  public abstract setDefaults(value: T): void;

  setFromOCRResponse(response: Response): void {
    // noop
  }


  subscribeToFormChange() {
    this.formSubscription?.unsubscribe();
    this.formSubscription = this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.formChange.next(this.form.value);
        })
      ).subscribe();
  }

  isFormValid(): boolean {
    return this.form.valid || this.form.disabled;
  }

  submitForm() {
    this.submitted = true;

    if (!this.isFormValid()) {
      return;
    }

    this.afterFormSubmit();
  }

  protected emitValue(value: T): void {
    this.formSubmit.emit(value);
  }

  parseApiValidationError(error: HttpErrorResponse) {
    if (error.error && error.error instanceof Object) {
      for (const [control, value] of Object.entries(error.error)) {
        this.form.get(control)?.setErrors({
          [ValidatorsErrors.apiValidationError]: value
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }
}
