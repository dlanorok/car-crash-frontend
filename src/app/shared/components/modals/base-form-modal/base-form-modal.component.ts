import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createNgModule,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormModalData } from "../interfaces/form-modal-data";
import { BaseFormComponent } from "../../forms/base-form.component";
import { combineLatest, filter, map, Observable, of, ReplaySubject, shareReplay, switchMap, take } from "rxjs";

@Component({
  selector: 'app-base-form-modal',
  templateUrl: './base-form-modal.component.html'
})
export class BaseFormModalComponent<T, C extends BaseFormComponent<T>, R> implements AfterViewInit {
  @ViewChild('formContainer', {read: ViewContainerRef}) formContainer!: ViewContainerRef;

  readonly options$: ReplaySubject<FormModalData<T, C, R>> = new ReplaySubject<FormModalData<T, C, R>>(1);
  tplInit$: ReplaySubject<void> = new ReplaySubject<void>();

  private readonly componentRef$: Observable<ComponentRef<C>> = combineLatest([this.options$, this.tplInit$]).pipe(
    map(([options, tpl]) => {
      const componentRef: ComponentRef<C> = this.formContainer.createComponent(options.formComponent.component, {
        ngModuleRef: createNgModule(
          options.formComponent.module,
          options.formComponent.parentInjector ?? this.injector,
        ),
      });

      componentRef.changeDetectorRef.detectChanges();

      return componentRef;
    }),
    shareReplay(1)
  );

  @Input()
  set data(options: FormModalData<T, C, R>) {
    this.options$.next(options);
  }

  get formSubmit(): Observable<any> {
    return this.componentRef$.pipe(
      switchMap(c => c.instance.formSubmit)
    );
  }

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly injector: Injector)
  {
    this.componentRef$.subscribe();
    this.observeDefaultValuesChanges();
  }

  observeDefaultValuesChanges(): void {
    const componentInstanceWithSetDefaults$: Observable<BaseFormComponent<T> & { setDefaults(value: T): void }> =
      this.componentRef$.pipe(
        take(1),
        map(
          (dynamicComponentRef): BaseFormComponent<T> & { setDefaults?(value: T): void } => {
            return dynamicComponentRef.instance
          }
        ),
        filter(
          (componentInstance): componentInstance is BaseFormComponent<T> & { setDefaults(value: T): void } =>
            !!componentInstance.setDefaults,
        ),
      );

    const defaults$: Observable<T> = this.options$.pipe(
      map(options => {
        return of(options.model);
      }),
      filter((defaults$): defaults$ is Observable<T> => defaults$ !== undefined),
      switchMap(defaults$ => defaults$),
    );

    combineLatest([componentInstanceWithSetDefaults$, defaults$, this.componentRef$])
      .subscribe(([componentInstanceWithSetDefaults, defaults, componentRef]) => {
        componentInstanceWithSetDefaults.setDefaults(defaults);
        componentRef.injector.get(ChangeDetectorRef)?.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.tplInit$.next();
  }

  submitForm(): void {
    this.componentRef$.pipe(take(1)).subscribe(comp => comp.instance.submitForm());
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
