import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { BaseFormComponent } from "../base-form.component";
import { DriverModel } from "../../../models/driver.model";
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";
import { TextFieldType } from "@regulaforensics/document-reader-webclient";

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss']
})
export class DriverFormComponent extends BaseFormComponent<DriverModel> {
  hasOcrEnabled = true;
  ocrTitle = 'shared.ocr_driver_license';
  driver?: DriverModel;

  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        address: ['', Validators.required],
        driving_licence_number: ['', Validators.required],
        driving_licence_valid_to: [null, Validators.required],
      }
    );
  }

  setDefaults(value: DriverModel) {
    this.driver = value;
    this.form.patchValue({
      name: value.name,
      surname: value.surname,
      address: value.address,
      driving_licence_number: value.driving_licence_number,
      driving_licence_valid_to: new Date(value.driving_licence_valid_to ?? ''),
    });
  }

  protected override afterFormSubmit() {
    const driver = new DriverModel({
      ...this.driver,
      ...this.form.value
    });
    this.emitValue(driver);
  }

  override setFromOCRResponse(response: Response): void {
    const dateOfExpiry: string | undefined = response.text?.getFieldValue(TextFieldType.DATE_OF_EXPIRY);
    this.form.patchValue({
      name: response.text?.getFieldValue(TextFieldType.FIRST_NAME) || response.text?.getFieldValue(TextFieldType.GIVEN_NAME) ,
      surname: response.text?.getFieldValue(TextFieldType.SURNAME),
      address: response.text?.getFieldValue(TextFieldType.ADDRESS),
      driving_licence_number: response.text?.getFieldValue(TextFieldType.DOCUMENT_NUMBER),
      driving_licence_valid_to: dateOfExpiry ? new Date(dateOfExpiry) : ''
    });
  }

}
