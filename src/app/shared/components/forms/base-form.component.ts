import { UntypedFormGroup } from "@angular/forms";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ValidatorsErrors } from "./common/enumerators/validators-errors";

@Component({
  template: '',
})
export abstract class BaseFormComponent<T> implements OnInit {
  form!: UntypedFormGroup;
  submitted: boolean = false;

  @Output() formSubmit: EventEmitter<T> = new EventEmitter<T>();

  ngOnInit(): void {
    this.initForm();
  }

  protected abstract initForm(): void;
  abstract submitForm(): void;

  protected validateForm(formGroup: UntypedFormGroup = this.form): void {
    this.submitted = true;
  }

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
