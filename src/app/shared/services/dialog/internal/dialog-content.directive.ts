import {
  createNgModule,
  Directive,
  Injector,
  Input,
  Type,
  ViewContainerRef,
  OnInit,
  EventEmitter,
  ComponentRef,
  Output,
} from '@angular/core';
import { writeComponentRefChanges } from "@app/shared/common/write-component-ref-changes";
@Directive({
  selector: '[appDialogContent]',
})
export class DialogContentDirective<T> implements OnInit {
  @Input() appDialogContent!: Type<T>;
  @Input() appDialogContentModule!: Type<any>;
  @Input() appDialogContentParams?: Partial<T>;
  @Input() appDialogContentInjector?: Injector;
  @Output() componentRef: EventEmitter<ComponentRef<T>> = new EventEmitter<ComponentRef<T>>();

  constructor(public viewContainerRef: ViewContainerRef, private readonly injector: Injector) {}

  ngOnInit(): void {
    const componentRef = this.viewContainerRef.createComponent(this.appDialogContent, {
      ngModuleRef: createNgModule(this.appDialogContentModule, this.appDialogContentInjector ?? this.injector),
      injector: this.appDialogContentInjector ?? this.injector,
    });
    if (this.appDialogContentParams) {
      writeComponentRefChanges(componentRef, this.appDialogContentParams);
    }
    this.componentRef.emit(componentRef);
  }
}
