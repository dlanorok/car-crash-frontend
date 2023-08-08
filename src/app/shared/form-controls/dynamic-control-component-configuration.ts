import { Injector, Type } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';

export interface DynamicControlComponentConfiguration<C extends ControlValueAccessor> {
  component: Type<C>;
  module: Type<any>;
  injector?: Injector;

  componentStaticInputs: Partial<C>;

  componentReactiveInputs?: {
    [key in keyof C]?: Observable<C[key]>;
  };

  componentReactiveOutputs?: {
    [key in keyof C]?: C[key] extends Observable<infer U> ? (value: U) => void : never;
  };
}
