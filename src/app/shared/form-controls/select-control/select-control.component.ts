import { Component, Input, TemplateRef } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss'],
  providers: [provideControlValueAccessor(SelectControlComponent)],
})
export class SelectControlComponent<T extends { value: string, label: string }> extends BaseFormControlComponent<string> {

  @Input() items?: T[] = [];
  @Input() customOptionTemplate?: TemplateRef<{ $implicit: T }>;
}
