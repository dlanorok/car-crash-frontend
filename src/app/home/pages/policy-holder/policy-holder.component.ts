import { Component, OnInit, ViewChild } from '@angular/core';
import { PolicyHoldersApiService } from "../../../shared/api/policy-holders/policy-holders-api.service";
import { PolicyHolderModel } from "../../../shared/models/policy-holder.model";
import { EMPTY, finalize, map, mergeMap, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { PolicyHolderFormComponent } from "../../../shared/components/forms/policy-holder-form/policy-holder-form.component";

@Component({
  selector: 'app-policy-holder',
  templateUrl: './policy-holder.component.html',
  styleUrls: ['./policy-holder.component.scss']
})
export class PolicyHolderComponent implements OnInit {
  policyHolder?: PolicyHolderModel;

  @ViewChild('policyHolderForm', { static: false }) protected policyHolderForm?: PolicyHolderFormComponent;

  constructor(
    private readonly policyHoldersApiService: PolicyHoldersApiService,
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
              finalize(() => {
                if (!this.policyHolder) {
                  return
                }
                this.policyHolderForm?.setDefaults(this.policyHolder);
              })
            );
        }),
      ).subscribe()
  }

  ngAfterViewInit(): void {
    this.subscribeAfterFormSubmit()
  }


  submitForm() {
    this.policyHolderForm?.submitForm();
  }

  private subscribeAfterFormSubmit() {
    this.policyHolderForm?.formSubmit
      .pipe(
        mergeMap((model: PolicyHolderModel) => {
          this.policyHolder = {
            ...this.policyHolder,
            ...model
          }
          return this.policyHoldersApiService.create(this.policyHolder);
        })
      ).subscribe()
  }
}
