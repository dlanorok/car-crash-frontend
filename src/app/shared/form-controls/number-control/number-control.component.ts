import { Component } from '@angular/core';
import { BaseFormControlComponent } from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-number-control',
  templateUrl: './number-control.component.html',
  styleUrls: ['./number-control.component.scss']
})
export class NumberControlComponent extends BaseFormControlComponent<number>{

}
