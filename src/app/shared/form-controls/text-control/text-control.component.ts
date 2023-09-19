import { Component, Input } from '@angular/core';
import { BaseFormControlComponent, provideControlValueAccessor } from "../base-form-control.component";

@Component({
  selector: 'app-text-control',
  templateUrl: './text-control.component.html',
  styleUrls: ['./text-control.component.scss'],
  providers: [provideControlValueAccessor(TextControlComponent)]
})
export class TextControlComponent extends BaseFormControlComponent<string>{
  @Input() type = 'text';
  @Input() onChangeAction: 'capitalize' | null = null;

  override handleModelChange(value: string) {
    if (this.onChangeAction === 'capitalize') {
      value = value.toUpperCase();
    }
    super.handleModelChange(value);
  }
}
