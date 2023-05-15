import { Component } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { BaseFormComponent } from "../base-form.component";
import { InsuranceModel } from "../../../models/insurance.model";

@Component({
  selector: 'app-insurance-form',
  templateUrl: './insurance-form.component.html',
  styleUrls: ['./insurance-form.component.scss']
})
export class InsuranceFormComponent extends BaseFormComponent<InsuranceModel> {
  constructor(private readonly formBuilder: FormBuilder) {
    super()
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        name: [''],
        policy_number: [''],
        agent: [''],
        green_card: [''],
        valid_until: [''],
        damaged_insured: [''],
      }
    );
  }

  setDefaults(value: InsuranceModel) {
    this.form.patchValue({
      name: value.name,
      policy_number: value.policy_number,
      agent: value.agent,
      green_card: value.green_card,
      valid_until: new Date(value.valid_until ?? ''),
      damaged_insured: value.damaged_insured,
    })
  }

  submitForm() {
    const insurance = new InsuranceModel({
      ...this.form.value
    })
    this.emitValue(insurance);
  }

}
