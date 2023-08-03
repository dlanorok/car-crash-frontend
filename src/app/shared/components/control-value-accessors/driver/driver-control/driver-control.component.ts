import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { DriverModel } from "@app/shared/models/driver.model";
import { TextFieldType } from "@regulaforensics/document-reader-webclient";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import { tap } from "rxjs";

@Component({
  selector: 'app-driver-control',
  templateUrl: './driver-control.component.html',
  styleUrls: ['./driver-control.component.scss'],
  providers: [provideControlValueAccessor(DriverControlComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverControlComponent extends BaseFormControlComponent<DriverModel> implements AfterViewInit {
  @ViewChild('driverForm', {static: false}) protected driverForm?: DriverFormComponent;

  ngAfterViewInit() {
    this.driverForm?.form.valueChanges.pipe(
      tap((value) => {
        const driverModel = new DriverModel({
          ...value
        });
        this.handleModelChange(driverModel);
      })
    ).subscribe();
  }

  processOCRResponse(response: Response): void {
    const dateOfExpiry: string | undefined = response.text?.getFieldValue(TextFieldType.DATE_OF_EXPIRY);
    const driver = {
      name: response.text?.getFieldValue(TextFieldType.FIRST_NAME) || response.text?.getFieldValue(TextFieldType.GIVEN_NAME),
      surname: response.text?.getFieldValue(TextFieldType.SURNAME),
      address: response.text?.getFieldValue(TextFieldType.ADDRESS),
      driving_licence_number: response.text?.getFieldValue(TextFieldType.DOCUMENT_NUMBER),
      driving_licence_valid_to: dateOfExpiry ? new Date(dateOfExpiry) : ''
    };
    const driverModel = new DriverModel({
      ...driver
    });
    this.handleModelChange(driverModel);
  }
}
