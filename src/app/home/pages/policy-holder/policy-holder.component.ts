import { Component, OnInit } from '@angular/core';
import { PolicyHoldersApiService } from "../../../shared/api/policy-holders/policy-holders-api.service";
import { PolicyHolder, PolicyHolderModel } from "../../../shared/models/policy-holder.model";
import { FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, fromEvent, mergeMap, Observable, tap } from "rxjs";

@Component({
  selector: 'app-policy-holder',
  templateUrl: './policy-holder.component.html',
  styleUrls: ['./policy-holder.component.scss']
})
export class PolicyHolderComponent implements OnInit {
  policyHolder: PolicyHolder = new PolicyHolderModel();
  form!: UntypedFormGroup;
  formValueChanges$!: Observable<any>;

  constructor(
    private readonly policyHoldersApiService: PolicyHoldersApiService,
    private readonly formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setForm();
    this.subscribeToFormChange()
  }

  private setForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [this.policyHolder.name],
        surname: [this.policyHolder.surname],
        email: [this.policyHolder.email],
        post_number: [this.policyHolder.post_number],
        country_code: [this.policyHolder.country_code],
      }
    )
  }

  private subscribeToFormChange() {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap(() => this.savePolicyHolder())
      ).subscribe()
  }

  private savePolicyHolder(): Observable<PolicyHolderModel> {
    return this.policyHoldersApiService.create(this.form.value);
  }

  submitForm() {
    console.log(this.form.value)
  }
}
