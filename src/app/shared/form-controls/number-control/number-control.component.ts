import { Component } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-number-control',
  templateUrl: './number-control.component.html',
  styleUrls: ['./number-control.component.scss'],
  providers: [provideControlValueAccessor(NumberControlComponent)],
})
export class NumberControlComponent extends BaseFormControlComponent<number>{

}
