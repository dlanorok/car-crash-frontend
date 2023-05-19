import { UntypedFormGroup } from "@angular/forms";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ValidatorsErrors } from "./common/enumerators/validators-errors";
import { debounceTime, distinctUntilChanged, skip, tap } from "rxjs";

@Component({
  template: '',
})
export abstract class BaseFormComponent<T> implements OnInit {
  form!: UntypedFormGroup;
  submitted: boolean = false;

  @Output() formSubmit: EventEmitter<T> = new EventEmitter<T>();
  @Output() formChange: EventEmitter<T> = new EventEmitter<T>();

  ngOnInit(): void {
    this.initForm();
    this.subscribeToFormChange();
  }

  protected abstract initForm(): void;
  public abstract setDefaults(value: T): void;


  subscribeToFormChange() {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        skip(1),
        tap(() => this.formChange.next(this.form.value))
      ).subscribe()
  }

  submitForm() {
    this.submitted = true;

    if (!this.form.valid) {
      return;
    }
  };

  protected emitValue(value: T): void {
    this.formSubmit.emit(value);
  }

  parseApiValidationError(error: HttpErrorResponse) {
    if (error.error && error.error instanceof Object) {
      for (const [control, value] of Object.entries(error.error)) {
        this.form.get(control)?.setErrors({
          [ValidatorsErrors.apiValidationError]: value
        })
      }
    }
  }
}
