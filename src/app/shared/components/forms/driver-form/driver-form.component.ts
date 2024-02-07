import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { BaseFormComponent } from "../base-form.component";
import { DriverModel } from "../../../models/driver.model";
import { TextFieldType, Response } from "@regulaforensics/document-reader-webclient";
import { updateEntireFormValidity } from "@app/shared/forms/helpers/update-entire-form-validity";

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss']
})
export class DriverFormComponent extends BaseFormComponent<DriverModel> {
  hasOcrEnabled = true;
  ocrTitle = 'shared.ocr_driver_license';

  @Input() driver?: DriverModel | undefined | null;

  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        name: [this.driver?.name || '', Validators.required],
        surname: [this.driver?.surname || '', Validators.required],
        address: [this.driver?.address || '', Validators.required],
        driving_licence_number: [this.driver?.driving_licence_number || '', Validators.required],
        driving_licence_category: [this.driver?.driving_licence_category || '', Validators.required],
        date_of_birth: [this.driver?.date_of_birth || '', Validators.required],
        driving_licence_valid_to: [this.driver?.driving_licence_valid_to ? new Date(this.driver?.driving_licence_valid_to) : null, Validators.required],
        country: [this.driver?.country || ''],
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
      driving_licence_valid_to: value.driving_licence_valid_to ? new Date(value.driving_licence_valid_to) : null,
      country: value.country,
      date_of_birth: value.date_of_birth ? new Date(value.date_of_birth) : null,
      driving_licence_category: value.driving_licence_category,
    }, {emitEvent: false});
  }

  protected override afterFormSubmit() {
    const driver = new DriverModel({
      ...this.driver,
      ...this.form.value
    });
    this.emitValue(driver);
  }

  submitForm() {
    this.submitted = true;
    updateEntireFormValidity(this.form);
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
