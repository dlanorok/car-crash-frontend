import { Component } from '@angular/core';
import { BaseFormComponent } from "../base-form.component";
import { PolicyHolderModel } from "../../../models/policy-holder.model";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-policy-holder-form',
  templateUrl: './policy-holder-form.component.html',
  styleUrls: ['./policy-holder-form.component.scss']
})
export class PolicyHolderFormComponent extends BaseFormComponent<PolicyHolderModel>{
  policyHolder?: PolicyHolderModel;

  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected initForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [this.policyHolder?.name, Validators.required],
        surname: [this.policyHolder?.surname, Validators.required],
        email: [this.policyHolder?.email, Validators.required],
        post_number: [this.policyHolder?.post_number, Validators.required],
        country_code: [this.policyHolder?.country_code, Validators.required],
      }
    );
  }

  setDefaults(value: PolicyHolderModel) {
    this.policyHolder = value;
    this.form.patchValue({
      name: value.name,
      surname: value.surname,
      email: value.email,
      post_number: value.post_number,
      country_code: value.country_code,
    });
  }

  protected override afterFormSubmit() {
    const policyHolder = new PolicyHolderModel({
      ...this.policyHolder,
      ...this.form.value
    });
    this.emitValue(policyHolder);
  }

}
