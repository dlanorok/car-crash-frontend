import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { DriverModel } from "@app/shared/models/driver.model";
import { TextFieldType } from "@regulaforensics/document-reader-webclient";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import { distinctUntilChanged, filter, Subject, takeUntil, tap } from "rxjs";

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
  loading = false;

  @ViewChild('driverForm', {static: false}) protected driverForm?: DriverFormComponent;

  ngAfterViewInit() {
    this.isDisabled$.pipe(
      takeUntil(this.destroy$),
      tap((disabled) => {
        disabled ? this.driverForm?.form.disable({emitEvent: false}) : this.driverForm?.form.enable({emitEvent: false});
      })
    ).subscribe();

    this.value$.pipe(
      takeUntil(this.driverInitialized$),
      filter((driver: DriverModel | undefined | null): driver is DriverModel => !!driver),
      tap((driver) => {
        this.driverForm?.setDefaults(driver);
        this.driverInitialized$.next();
      })
    ).subscribe();

    this.driverForm?.form.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      tap((value) => {
        const driverModel = new DriverModel({
          ...value
        });
        this.handleModelChange(driverModel);
      })
    ).subscribe();
  }

  processOCRResponse(response: Response | undefined): void {
    let driverModel = new DriverModel({});
    if (response) {
      const dateOfExpiry: string | undefined = response.text?.getFieldValue(TextFieldType.DATE_OF_EXPIRY);
      const driver = {
        name: response.text?.getFieldValue(TextFieldType.FIRST_NAME) || response.text?.getFieldValue(TextFieldType.GIVEN_NAME),
        surname: response.text?.getFieldValue(TextFieldType.SURNAME),
        address: response.text?.getFieldValue(TextFieldType.ADDRESS),
        driving_licence_number: response.text?.getFieldValue(TextFieldType.DOCUMENT_NUMBER),
        driving_licence_valid_to: dateOfExpiry ? new Date(dateOfExpiry) : ''
      };
      driverModel = new DriverModel({
        ...driver
      });
    }
    this.driverForm?.setDefaults(driverModel);
    this.handleModelChange(driverModel);
  }

  ngOnDestroy() {
    this.driverInitialized$.next();
    this.driverInitialized$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
