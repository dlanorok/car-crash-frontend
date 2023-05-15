import { Component } from '@angular/core';
import { BaseFormControlComponent, provideControlValueAccessor } from "../base-form-control.component";

@Component({
  selector: 'app-date-control',
  templateUrl: './date-control.component.html',
  providers: [provideControlValueAccessor(DateControlComponent)]
})
export class DateControlComponent extends BaseFormControlComponent<Date>{

}
