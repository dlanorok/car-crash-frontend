import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { DriverModel } from "@app/shared/models/driver.model";
import { TextFieldType } from "@regulaforensics/document-reader-webclient";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import {
  Subject,
  takeUntil,
  tap,
  combineLatest,
  BehaviorSubject,
  filter, switchMap
} from "rxjs";
import { ValidatorsErrors } from "@app/shared/components/forms/common/enumerators/validators-errors";
import { LCID } from "@regulaforensics/document-reader-webclient";

@Component({
  selector: 'app-driver-control',
  templateUrl: './driver-control.component.html',
  styleUrls: ['./driver-control.component.scss'],
  providers: [provideControlValueAccessor(DriverControlComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverControlComponent extends BaseFormControlComponent<DriverModel> implements AfterViewInit, OnDestroy {
  protected destroy$: Subject<void> = new Subject<void>();
  protected driverInitialized$: Subject<void> = new Subject<void>();
  protected driverForm$: BehaviorSubject<DriverFormComponent | null> = new BehaviorSubject<DriverFormComponent | null>(null);
  loading = false;

  @ViewChild('driverForm', {static: false}) set driverForm(driverForm: DriverFormComponent) {
    if (driverForm) {
      this.driverForm$.next(driverForm);
      this.formControl.setValidators((() => {
        if (driverForm.form.valid) {
          return null;
        }
        return {
          [ValidatorsErrors.required]: true
        };
      }));
    }
  }

  ngAfterViewInit() {
    combineLatest([this.isDisabled$, this.driverForm$]).pipe(
      takeUntil(this.destroy$),
      tap(([disabled, driverForm]) => {
        if (disabled && !!driverForm) {
          disabled ? driverForm.form.disable({emitEvent: false}) : this.driverForm?.form.enable({emitEvent: false});
        }
      })
    ).subscribe();

    combineLatest([this.value$, this.driverForm$]).pipe(
      takeUntil(this.driverInitialized$),
      tap(([driver, driverForm]: [DriverModel | undefined | null, DriverFormComponent | null]) => {
        if (!!driver && driverForm) {
          driverForm.setDefaults(driver);
          this.driverInitialized$.next();
        }
      })
    ).subscribe();

    this.driverForm$.pipe(
      filter((driverForm): driverForm is DriverFormComponent=> !!driverForm),
      switchMap(driverForm => driverForm.form.valueChanges),
      takeUntil(this.destroy$),
    ).subscribe((value) => {
      const driverModel = new DriverModel({
        ...value
      });
      this.handleModelChange(driverModel);
    });
  }

  processOCRResponse(response: Response | undefined): void {
    let driverModel = new DriverModel({});
    if (response) {
      const dateOfExpiry: string | undefined = this.findLocaleFieldValue(response, TextFieldType.DATE_OF_EXPIRY);
      const driver = {
        name: this.findLocaleFieldValue(response, TextFieldType.FIRST_NAME) || this.findLocaleFieldValue(response, TextFieldType.GIVEN_NAMES) || '',
        surname: this.findLocaleFieldValue(response, TextFieldType.SURNAME) || '',
        address: this.findLocaleFieldValue(response, TextFieldType.ADDRESS)?.replace("^", "\n"),
        country: this.findLocaleFieldValue(response, TextFieldType.ISSUING_STATE_CODE),
        driving_licence_number: this.findLocaleFieldValue(response, TextFieldType.DOCUMENT_NUMBER),
        driving_licence_valid_to: dateOfExpiry ? new Date(dateOfExpiry) : ''
      };

      driver.name = driver.name.length > 1 ? driver.name.charAt(0).toUpperCase() + driver.name.slice(1) : driver.name;
      driver.surname = driver.surname.length > 1 ? driver.surname.charAt(0).toUpperCase() + driver.surname.slice(1) : driver.surname;
      driverModel = new DriverModel({
        ...driver
      });
    }
    this.handleModelChange(driverModel);
  }

  private findLocaleFieldValue(response: Response, type: TextFieldType) {
    let latinValue = undefined;
    let localeValue = undefined;
    for (const field of (response.text?.fieldList || [])) {
      if (field.fieldType == type) {
        if (field.lcid && field.lcid > 0) {
          localeValue = field;
        }

        if (!field.lcid || field.lcid === LCID.LATIN) {
          latinValue = field;
        }
      }
    }

    return localeValue ? localeValue.getValue() : (latinValue?.getValue() || '');
  }

  ngOnDestroy() {
    this.driverInitialized$.next();
    this.driverInitialized$.complete();
    this.driverForm$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
