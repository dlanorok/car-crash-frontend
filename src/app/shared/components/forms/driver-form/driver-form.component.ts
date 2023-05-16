import { Component } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { BaseFormComponent } from "../base-form.component";
import { DriverModel } from "../../../models/driver.model";

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss']
})
export class DriverFormComponent extends BaseFormComponent<DriverModel> {
  constructor(private readonly formBuilder: FormBuilder) {
    super()
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        name: [''],
        surname: [''],
        address: [''],
        driving_licence_number: [''],
        driving_licence_valid_to: [null],
      }
    );
  }

  setDefaults(value: DriverModel) {
    this.form.patchValue({
      name: value.name,
      surname: value.surname,
      address: value.address,
      driving_licence_number: value.driving_licence_number,
      driving_licence_valid_to: new Date(value.driving_licence_valid_to ?? ''),
    })
  }

  override submitForm() {
    super.submitForm();

    const driver = new DriverModel({
      ...this.form.value
    })
    this.emitValue(driver);
  }

}
