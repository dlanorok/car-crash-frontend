import { Component } from '@angular/core';
import { BaseFormControlComponent, provideControlValueAccessor } from "../base-form-control.component";

@Component({
  selector: 'app-yes-no-checkbox',
  templateUrl: './yes-no-checkbox.component.html',
  styleUrls: ['./yes-no-checkbox.component.scss'],
  providers: [provideControlValueAccessor(YesNoCheckboxComponent)],
})
export class YesNoCheckboxComponent extends BaseFormControlComponent<boolean | null>{}
