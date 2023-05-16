import { Component } from '@angular/core';
import { BaseFormControlComponent, provideControlValueAccessor } from "../base-form-control.component";

@Component({
  selector: 'app-checkbox-control',
  templateUrl: './checkbox-control.component.html',
  providers: [provideControlValueAccessor(CheckboxControlComponent)]
})
export class CheckboxControlComponent extends BaseFormControlComponent<boolean> {

}
