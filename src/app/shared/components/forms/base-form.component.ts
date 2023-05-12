import { UntypedFormGroup } from "@angular/forms";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  template: '',
})
export abstract class BaseFormComponent<T> implements OnInit {
  form!: UntypedFormGroup;

  @Output() formSubmit: EventEmitter<T> = new EventEmitter<T>();

  ngOnInit(): void {
    this.initForm();
  }

  protected abstract initForm(): void;
  abstract submitForm(): void;

  protected emitValue(value: T): void {
    this.formSubmit.emit(value);
  }
}
