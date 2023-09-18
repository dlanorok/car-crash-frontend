import { Component, Input } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";

@Component({
  selector: 'app-text-area-control',
  templateUrl: './text-area-control.component.html',
  styleUrls: ['./text-area-control.component.scss'],
  providers: [provideControlValueAccessor(TextAreaControlComponent)]
})
export class TextAreaControlComponent extends BaseFormControlComponent<string>{
  @Input() rows = 4;
}
