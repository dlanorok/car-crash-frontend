import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { CrashModel } from "../../../models/crash.model";
import { BaseFormComponent } from "../base-form.component";

@Component({
  selector: 'app-crash-form',
  templateUrl: './crash-form.component.html',
  styleUrls: ['./crash-form.component.scss']
})
export class CrashFormComponent extends BaseFormComponent<CrashModel> {
  crash?: CrashModel;
  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        date_of_accident: [new Date(), Validators.required],
        country: ['', Validators.required],
        place: ['', Validators.required],
        participants: [2, Validators.required],
        injuries: [null, Validators.required],
        vehicle_material_damage: [null, Validators.required],
        other_material_damage: [null, Validators.required]
      }
    );
  }

  setDefaults(value: CrashModel) {
    this.crash = value;
    this.form.patchValue({
      date_of_accident: value.date_of_accident ? new Date(value.date_of_accident) : new Date(),
      country: value.country,
      place: value.place,
      participants: value.participants,
      injuries: value.injuries,
      vehicle_material_damage: value.vehicle_material_damage,
      other_material_damage: value.other_material_damage
    }, {emitEvent: false});
  }

  protected override afterFormSubmit() {
    const crash = new CrashModel({
      ...this.crash,
      ...this.form.value
    });
    this.emitValue(crash);
  }
}
