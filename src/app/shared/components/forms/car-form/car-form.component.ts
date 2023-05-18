import { Component } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { CarModel } from "../../../models/car.model";
import { BaseFormComponent } from "../base-form.component";

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent extends BaseFormComponent<CarModel> {
  car?: CarModel;
  constructor(private readonly formBuilder: FormBuilder) {
    super()
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        car_type: [''],
        make_type: [''],
        registration_country: [''],
        registration_plate: [''],
      }
    );
  }

  override setDefaults(value: CarModel): void {
    this.car = value;
    this.form.patchValue({
      car_type: value.car_type,
      make_type: value.make_type,
      registration_country: value.registration_country,
      registration_plate: value.registration_plate,
    })
  }

  override submitForm() {
    super.submitForm();

    const car = new CarModel({
      ...this.car,
      ...this.form.value
    })
    this.emitValue(car);
  }

}
