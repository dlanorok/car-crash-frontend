import { Component } from '@angular/core';
import { countries } from "countries-list";
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-country-control',
  templateUrl: './country-control.component.html',
  styleUrls: ['./country-control.component.scss'],
  providers: [provideControlValueAccessor(CountryControlComponent)],
})
export class CountryControlComponent extends BaseFormControlComponent<string> {

  countries = Object.entries(countries).map(([key, value]) => {
    return { id: key, ...value };
  });
}
