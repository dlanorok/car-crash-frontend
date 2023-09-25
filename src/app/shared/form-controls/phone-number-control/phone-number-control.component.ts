import { Component, OnInit } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, of, takeUntil, filter } from "rxjs";
import { updateEntireFormValidity } from '@app/shared/forms/helpers/update-entire-form-validity';
import { map, take } from "rxjs/operators";

@Component({
  selector: 'app-phone-number-control',
  templateUrl: './phone-number-control.component.html',
  styleUrls: ['./phone-number-control.component.scss'],
  providers: [provideControlValueAccessor(PhoneNumberControlComponent)],
})
export class PhoneNumberControlComponent extends BaseFormControlComponent<ChangeData> implements OnInit {
  readonly CountryISO = CountryISO;
  readonly SearchCountryField = SearchCountryField;

  phoneForm = new FormGroup({
    phone: new FormControl({})
  });

  override handleModelChange(value: ChangeData) {
    const currentValue = this.value$.getValue();
    if (currentValue?.number !== value?.number) {
      super.handleModelChange(value);
    }
  }

  beforeSubmit(): Observable<boolean> {
    return of(undefined).pipe(
      map(() => {
        updateEntireFormValidity(this.phoneForm);
        return this.phoneForm.controls.phone.valid;
      }),
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.phoneForm.controls.phone.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (value) {
        this.handleModelChange(value);
      }
    });

    this.value$.pipe(
      filter((value): value is ChangeData => !!value),
      take(1)
    ).subscribe((value) => {
      this.phoneForm.controls.phone.setValue(value);
    });
  }

}
