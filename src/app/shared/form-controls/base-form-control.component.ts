import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component(
  {
    template: '',
  },
)
export abstract class BaseFormControlComponent<T> implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() submitted?: boolean;

  @Input() formControl!: FormControl;
  value?: T;

  constructor() {}

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

}

export function provideControlValueAccessor(component: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true
  };
}
