import { AfterContentInit, Component } from '@angular/core';
import { countries } from "countries-list";
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { tap } from "rxjs";

@Component({
  selector: 'app-country-control',
  templateUrl: './country-control.component.html',
  styleUrls: ['./country-control.component.scss'],
  providers: [provideControlValueAccessor(CountryControlComponent)],
})
export class CountryControlComponent extends BaseFormControlComponent<string> implements AfterContentInit {

  ngAfterContentInit() {
    this.value$.pipe(
      tap((value) => {
        if (!value) {
          super.writeValue('SI');
        }
      })
    ).subscribe();
  }

  items = Object.entries(countries).map(([key, value]) => {
    return { value: key, label: value.name, ...value };
  });
}
