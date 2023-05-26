import { Injector, Type } from "@angular/core";
import { Observable } from "rxjs";

export interface FormModalData<T, C, R> {
  formComponent: {
    component: Type<C>;
    module: Type<unknown>;
    parentInjector?: Injector;
  };
  title: string,
  model: T,
  afterSubmit$: (value: T) => Observable<R | never>;
}
