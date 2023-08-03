import { Component, Input } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { Option } from "@app/home/pages/crash/flow.definition";

@Component({
  selector: 'app-stacked-select-control',
  templateUrl: './stacked-select-control.component.html',
  providers: [provideControlValueAccessor(StackedSelectControlComponent)],
  styleUrls: ['./stacked-select-control.component.scss']
})
export class StackedSelectControlComponent extends BaseFormControlComponent<string | boolean> {
  @Input() options: Option[] | undefined = [];
}
