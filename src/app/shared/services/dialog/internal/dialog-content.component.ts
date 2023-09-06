import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { OpenDialogOptions } from "@app/shared/components/modals/interfaces/open-dialog-options";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DIALOG_CONTENT, DialogContent } from "@app/shared/services/dialog/internal/modal-content-element-ref";

@Component({
  template: `
    <div *ngIf="options.title$ | async; let title" class="dialog-panel-header">
      <h3>{{ title }}</h3>
      <a *ngIf="options.isClosable" (click)="closeDialog()">
        <i class="bi bi-x"></i>
      </a>
    </div>

    <div *ngIf="options.componentData" class="dialog-panel-content">
      <ng-container *ngIf="browserDialogContentInjector">
        <ng-template
          [appDialogContent]="options.componentData.component"
          [appDialogContentModule]="options.componentData.module"
          [appDialogContentParams]="options.componentParams"
          [appDialogContentInjector]="browserDialogContentInjector"
          (componentRef)="componentRef.emit($event)"
        ></ng-template>
      </ng-container>
    </div>

<!--    <div-->
<!--      *ngIf="options.primaryButton && (options.primaryButton.text$ | async)"-->
<!--      class="flex justify-end padding-bottom-half padding-right"-->
<!--    >-->
<!--      <eos-button-->
<!--        [isDisabled]="(options.primaryButton.isDisabled$ | async) === true"-->
<!--        [isLoading]="(options.primaryButton.isLoading$ | async) === true"-->
<!--        (click)="handleButtonClick()"-->
<!--        color="systemContrast"-->
<!--        fill="color"-->
<!--        >{{ options.primaryButton.text$ | async }}</eos-button-->
<!--      >-->
<!--    </div>-->
  `,
  styleUrls: ['./dialog-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogContentComponent<C> {
  private _options!: OpenDialogOptions<C>;
  // when using ModalService, OnChanges can't register Input changes, so we need to use setter to pass value to injector
  @Input() set options(options: OpenDialogOptions<C>) {
    this._options = options;
    this.browserDialogContentInjector = Injector.create({
      providers: [
        {
          provide: DIALOG_CONTENT,
          useValue: { contentElementRef: this.elementRef, close: () => this.dialogRef?.close() } as DialogContent,
        },
      ],
      parent: options.componentData?.parentInjector ?? this.injector,
    });
  }

  get options(): OpenDialogOptions<C> {
    return this._options;
  }

  @Input() dialogRef?: NgbModalRef;
  @Output() componentRef: EventEmitter<ComponentRef<C>> = new EventEmitter<ComponentRef<C>>();

  browserDialogContentInjector?: Injector;

  constructor(private readonly injector: Injector, private readonly elementRef: ElementRef) {}

  closeDialog(): void {
    this.dialogRef?.close();
    //   const wrapper: HTMLElement = document.getElementsByClassName('cdk-global-overlay-wrapper')[0] as any;
    //   wrapper.style.transformOrigin = 'top';
    //   const animation = wrapper.animate([{ transform: 'none' }, { transform: 'scale(0)' }], {
    //     duration: 200,
    //     easing: 'ease-out',
    //   });
    //   animation.onfinish = () => {
    //     this.dialogRef?.close();
    //   };
  }

  // handleButtonClick(): void {
  //   const action = this.options.primaryButton?.action;
  //   if (!action) {
  //     this.closeDialog();
  //     return;
  //   }
  //
  //   this.componentRef.pipe(take(1), untilDestroyed(this)).subscribe(componentRef => {
  //     action(componentRef.instance);
  //   });
  // }
}
