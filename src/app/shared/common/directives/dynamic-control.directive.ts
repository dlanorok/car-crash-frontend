import { ComponentRef, createNgModule, Directive, inject, Injector, Input, ViewContainerRef } from '@angular/core';
import { combineLatest, debounceTime, Observable, Subject, Subscription } from "rxjs";
import { writeComponentRefChanges } from '@app/shared/common/write-component-ref-changes';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { DynamicControlComponentConfiguration } from "@app/shared/form-controls/dynamic-control-component-configuration";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Directive({
  selector: '[appDynamicControl]',
})
export class DynamicControlDirective<C extends ControlValueAccessor> extends NgControl {
  override control: AbstractControl | null = null;
  private readonly parent: ControlContainer | null = inject(ControlContainer, {
    optional: true,
    host: true,
    skipSelf: true,
  });

  private readonly injector: Injector = inject(Injector);
  private componentReactiveOutputsChangesSubscriptions?: Subscription[];
  controlComponentRef: ComponentRef<C> | null = null;

  private readonly controlComponentConfiguration$: Subject<DynamicControlComponentConfiguration<C>> = new Subject();
  @Input() set appDynamicControl(controlComponentConfiguration: DynamicControlComponentConfiguration<C> | null) {
    if (!controlComponentConfiguration) {
      return;
    }

    this.controlComponentConfiguration$.next(controlComponentConfiguration);
  }

  private readonly controlNameChange$: Subject<void> = new Subject<void>();
  @Input() set appDynamicControlName(name: string | number | null) {
    this.name = name;
    this.controlNameChange$.next();
  }

  constructor(public viewContainerRef: ViewContainerRef) {
    super();
    this.observeConfigurationChange();
  }

  private observeConfigurationChange() {
    combineLatest([
      this.controlComponentConfiguration$,
      this.controlNameChange$,
    ])
      .pipe(debounceTime(0), untilDestroyed(this))
      .subscribe(([controlComponentConfiguration]) => {
      if (this.controlComponentRef) {
        writeComponentRefChanges(this.controlComponentRef, controlComponentConfiguration.componentStaticInputs);
      } else {
        this.controlComponentRef = this.setupDynamicComponent(controlComponentConfiguration);
      }
    });
  }

  private setupDynamicComponent(controlComponentConfiguration: DynamicControlComponentConfiguration<C>): ComponentRef<C> | null {
    const injector = Injector.create({
      providers: [
        {
          provide: NgControl,
          useValue: this,
        },
      ],
      parent: controlComponentConfiguration.injector ?? this.injector,
    });

    // Render the control component.
    const controlComponentRef = this.viewContainerRef.createComponent(controlComponentConfiguration.component, {
      ngModuleRef: createNgModule(controlComponentConfiguration.module, injector),
      injector,
    });
    this.setupNgControl(controlComponentRef);
    this.writeComponentRefChanges(controlComponentRef, controlComponentConfiguration.componentStaticInputs);
    this.observeComponentReactiveOutputsChanges(
      controlComponentRef,
      controlComponentConfiguration.componentReactiveOutputs,
    );

    return controlComponentRef;
  }

  private observeComponentReactiveOutputsChanges(
    componentRef: ComponentRef<C & Record<any, any>>,
    reactiveOutputs: DynamicControlComponentConfiguration<C>['componentReactiveOutputs'],
  ): void {
    this.unsubscribeComponentReactiveOutputsChangesSubscriptions();

    if (!reactiveOutputs) {
      return;
    }

    this.componentReactiveOutputsChangesSubscriptions = Object.entries(reactiveOutputs)
      .filter(([outputPropertyName]) => componentRef.instance?.[outputPropertyName] instanceof Observable)
      .map(([outputPropertyName, outputValueChangesCallbackFn]) =>
        (componentRef.instance?.[outputPropertyName] as Observable<any>).pipe(untilDestroyed(this)).subscribe(value => {
          outputValueChangesCallbackFn(value);
        }),
      );
  }


  private unsubscribeComponentReactiveOutputsChangesSubscriptions(): void {
    if (!this.componentReactiveOutputsChangesSubscriptions) {
      return;
    }
    this.componentReactiveOutputsChangesSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.componentReactiveOutputsChangesSubscriptions = undefined;
  }

  private writeComponentRefChanges(controlComponentRef: ComponentRef<C>, changes: Partial<C>): void {
    writeComponentRefChanges(controlComponentRef, changes);
    controlComponentRef.changeDetectorRef.detectChanges();
  }

  private setupNgControl(controlComponentRef: ComponentRef<C>): void {
    if (!this.valueAccessor) {
      this.valueAccessor = controlComponentRef.injector.get(NG_VALUE_ACCESSOR)[0];
    }
    if (!this.control) {
      this.control = this.formDirective.addControl(this);
    }
  }

  /**
   * The top-level directive for this group if present, otherwise null.
   @see https://github.com/angular/angular/blob/main/packages/forms/src/directives/reactive_directives/form_control_name.ts
   */
  private get formDirective(): any {
    return this.parent ? this.parent.formDirective : null;
  }

  override get path(): string[] {
    const name: string | null = this.name === null ? null : this.name.toString();
    return [...this.parent!.path!, name!];
  }

  viewToModelUpdate(newValue: any): void {
    // noop and deprecated, previously used by ngModel
  }
}
