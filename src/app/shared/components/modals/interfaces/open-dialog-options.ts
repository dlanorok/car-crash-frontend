import { Injector, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap/modal/modal-config";


export interface OpenDialogOptions<C> {
  componentData?: {
    component: Type<C>;
    module: Type<any>;
    parentInjector?: Injector;
  };
  componentParams?: Partial<C>;
  isClosable?: boolean;
  title$?: Observable<string>;
  size?: string;
  options: NgbModalOptions
}
