import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { customAlphabet } from 'nanoid';
import { BehaviorSubject } from "rxjs";

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

  readonly value$: BehaviorSubject<T | undefined | null> = new BehaviorSubject<T | undefined | null>(undefined);

  readonly _id: string = customAlphabet('abcdefgijz', 12)();

  onChange: (value: T) => void = () => {
    //noop
  };

  onTouched: () => void = () => {
    //noop
  };

  writeValue(value: T): void {
    this.value$.next(value);
  }

  handleModelChange(value: T): void {
    this.value$.next(value);
    this.onChange(value);
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    if (!this.formControl) {
      return;
    }
    if ((disabled && this.formControl.disabled) || (!disabled && !this.formControl.disabled)) {
      return;
    }
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
