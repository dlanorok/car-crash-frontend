import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { customAlphabet } from 'nanoid';

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

  readonly _id: string = customAlphabet('abcdefgijz', 12)();

  onChange: () => void = () => {
    //noop
  };
  onTouched: () => void = () => {
    //noop
  };

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
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

// eslint-disable-next-line
export function provideControlValueAccessor(component: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true
  };
}
