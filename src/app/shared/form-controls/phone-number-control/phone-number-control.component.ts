import { Component } from '@angular/core';
import { BaseFormControlComponent } from "@app/shared/form-controls/base-form-control.component";
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ChangeData } from "ngx-intl-tel-input/lib/interfaces/change-data";

@Component({
  selector: 'app-phone-number-control',
  templateUrl: './phone-number-control.component.html',
  styleUrls: ['./phone-number-control.component.scss']
})
export class PhoneNumberControlComponent extends BaseFormControlComponent<ChangeData> {
  readonly CountryISO = CountryISO;
  readonly SearchCountryField = SearchCountryField;

}
