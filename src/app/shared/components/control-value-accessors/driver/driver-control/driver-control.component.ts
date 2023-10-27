import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
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
  filter, switchMap, Observable, of
} from "rxjs";
import { ValidatorsErrors } from "@app/shared/components/forms/common/enumerators/validators-errors";
import { LCID } from "@regulaforensics/document-reader-webclient";
import { ConfirmService } from "@app/shared/services/confirm/confirm.service";
import { TranslocoService } from "@ngneat/transloco";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-driver-control',
  templateUrl: './driver-control.component.html',
  styleUrls: ['./driver-control.component.scss'],
  providers: [provideControlValueAccessor(DriverControlComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverControlComponent extends BaseFormControlComponent<DriverModel> implements AfterViewInit, OnDestroy {
  private readonly confirmService: ConfirmService = inject(ConfirmService);
  private readonly translateService: TranslocoService = inject(TranslocoService);
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  protected destroy$: Subject<void> = new Subject<void>();
  protected driverInitialized$: Subject<void> = new Subject<void>();
  protected driverForm$: BehaviorSubject<DriverFormComponent | null> = new BehaviorSubject<DriverFormComponent | null>(null);
  loading = false;
  showOcr = true;

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
      const dateOfExpiry: string | undefined = this.findLocaleFieldValue(response, TextFieldType.DATE_OF_EXPIRY, true);
      const dateOfBirth: string | undefined = this.findLocaleFieldValue(response, TextFieldType.DATE_OF_BIRTH, true);
      const driver = {
        name: this.findLocaleFieldValue(response, TextFieldType.FIRST_NAME) || this.findLocaleFieldValue(response, TextFieldType.GIVEN_NAMES) || '',
        surname: this.findLocaleFieldValue(response, TextFieldType.SURNAME) || '',
        address: this.findLocaleFieldValue(response, TextFieldType.ADDRESS)?.replace("^", "\n"),
        country: this.findLocaleFieldValue(response, TextFieldType.ISSUING_STATE_CODE),
        driving_licence_number: this.findLocaleFieldValue(response, TextFieldType.DOCUMENT_NUMBER),
        driving_licence_valid_to: dateOfExpiry ? new Date(dateOfExpiry) : '',
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : ''
      };

      driver.name = driver.name.length > 1 ? driver.name.charAt(0).toUpperCase() + driver.name.slice(1) : driver.name;
      driver.surname = driver.surname.length > 1 ? driver.surname.charAt(0).toUpperCase() + driver.surname.slice(1) : driver.surname;
      driverModel = new DriverModel({
        ...driver
      });
    }
    this.handleModelChange(driverModel);
  }

  private findLocaleFieldValue(response: Response, type: TextFieldType, returnLatin = false) {
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

    return localeValue && !returnLatin ? localeValue.getValue() : (latinValue?.getValue() || '');
  }

  toggleOcr($event: boolean) {
    this.showOcr = $event;
    this.driverForm$.getValue()?.form.enable();
  }

  beforeSubmit(questionnaire: QuestionnaireModel): Observable<boolean> {
    this.driverForm$.getValue()?.submitForm();
    if (!this.driverForm$.getValue()?.form.valid) {
      return of(false);
    }

    return of(this.formControl.value).pipe(
      switchMap(value => {
        const driverPhoneNumberInput = questionnaire.data.inputs["34"];
        if (driverPhoneNumberInput.value !== null) {
          return of(true);
        }

        return this.confirmService.confirmOrDecline({
          confirmMessage: this.translateService.translate('shared.yes'),
          declineMessage: this.translateService.translate('shared.no'),
          description: this.translateService.translate('car-crash.copy-driver-data.description'),
          message: this.translateService.translate('car-crash.copy-driver-data.title'),
        }).pipe(
          map((value) => {

            if (value) {
              const insurancePhoneNumberInput = questionnaire.data.inputs["45"];
              const insuranceEmailInput = questionnaire.data.inputs["48"];
              this.questionnaireService.updateInputs({
                34: insurancePhoneNumberInput.value,
                33: insuranceEmailInput.value
              }, questionnaire);
            }
            return true;
          }));
      })
    );
  }

  ngOnDestroy() {
    this.driverInitialized$.next();
    this.driverInitialized$.complete();
    this.driverForm$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
