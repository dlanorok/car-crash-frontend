import { Component, OnInit } from '@angular/core';
import { PolicyHoldersApiService } from "../../../shared/api/policy-holders/policy-holders-api.service";
import { PolicyHolderModel } from "../../../shared/models/policy-holder.model";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged, EMPTY, finalize, map, mergeMap, Observable, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-policy-holder',
  templateUrl: './policy-holder.component.html',
  styleUrls: ['./policy-holder.component.scss']
})
export class PolicyHolderComponent implements OnInit {
  policyHolder?: PolicyHolderModel;
  form!: UntypedFormGroup;

  constructor(
    private readonly policyHoldersApiService: PolicyHoldersApiService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.setCar()
  }

  private setCar(): void {
    this.route.params
      .pipe(
        map((params)=> {
          return params['carId'];
        }),
        mergeMap((carId: string) => {
          return this.policyHoldersApiService.getSingle(carId)
            .pipe(
              tap((policyHolder: PolicyHolderModel) => {
                this.policyHolder = policyHolder;
              }),
              catchError(() => {
                this.policyHolder = new PolicyHolderModel({car: carId});
                return EMPTY;
              }),
              finalize(() => this.setForm())
            );
        }),
      ).subscribe()
  }

  private setForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [this.policyHolder?.name],
        surname: [this.policyHolder?.surname],
        email: [this.policyHolder?.email],
        post_number: [this.policyHolder?.post_number],
        country_code: [this.policyHolder?.country_code],
      }
    )
    this.subscribeToFormChange()
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
    const policyHolder = new PolicyHolderModel({
        ...this.policyHolder,
        ...this.form.value,
      }
    )

    return this.policyHoldersApiService.create(policyHolder);
  }

  submitForm() {
    this.savePolicyHolder()
      .pipe(
        tap(() => {
          this.router.navigate(
            [this.router.url.replace(/\/cars\/\d+\/policy-holder$/, '')]
          )
        })
      ).subscribe()
  }
}
