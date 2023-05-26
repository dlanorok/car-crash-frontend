import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFormHost]',
})
export class FormDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
