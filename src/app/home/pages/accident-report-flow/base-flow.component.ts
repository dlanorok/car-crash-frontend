import { AfterViewInit, Component, inject, OnInit, ViewChild } from "@angular/core";
import { BaseFormComponent } from "@app/shared/components/forms/base-form.component";
import { Observable, Subscription, tap } from "rxjs";
import { BaseModel } from "@app/shared/models/base.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { CookieService } from "ngx-cookie-service";
import { CarModel } from "@app/shared/models/car.model";
import { loadCars } from "@app/app-state/car/car-action";
import { Store } from "@ngrx/store";
import { selectCars } from "@app/app-state/car/car-selector";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { WebSocketService } from "@app/shared/services/web-socket.service";

@Component({
  template: '',
})
export abstract class BaseFlowComponent<T, C extends BaseModel> extends BaseFooterComponent implements OnInit, AfterViewInit {
  protected readonly router: Router = inject(Router);
  protected readonly translateService: TranslocoService = inject(TranslocoService);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly store: Store = inject(Store);
  protected readonly webSocketService: WebSocketService = inject(WebSocketService);

  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  @ViewChild('formComponent', {static: false}) protected formComponent?: BaseFormComponent<C>;

  @ViewChild('formComponent')
  set setCircumstanceForm(formComponent: BaseFormComponent<T>) {
    if (formComponent) {
      this.subscribeToFormChange();
      this.subscribeAfterFormSubmit();
    }
  }

  formChangeSubscription?: Subscription;
  model!: C;
  showOCRComponent = false;

  protected abstract observeStoreChange(): void;
  protected abstract saveForm(model: C, validate: boolean): void;
  protected abstract nextPage(): void;

  ngOnInit(): void {
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCars());
  }

  ngAfterViewInit() {
    this.observeStoreChange();
  }

  private subscribeToFormChange(): void {
    this.formChangeSubscription?.unsubscribe();
    this.formChangeSubscription = this.formComponent?.formChange
      .pipe(
        tap((model: C) => {
          this.saveForm(model, false);
        })
      ).subscribe();
  }

  private subscribeAfterFormSubmit(): void {
    this.formComponent?.formSubmit
      .pipe(
        tap((model: C) => {
          this.saveForm(model, true);
        })
      ).subscribe();
  }

  next(): void {
    if (this.formComponent?.form.disabled) {
      this.nextPage();
    } else {
      this.submit();
    }
  }

  submit(): void {
    this.formComponent?.submitForm();
  }

  processOCRResponse(response: Response) {
    this.formComponent?.setFromOCRResponse(response);
    this.showOCRComponent = false;
  }

}
