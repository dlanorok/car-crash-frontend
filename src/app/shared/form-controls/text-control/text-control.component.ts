import { Component } from '@angular/core';
import { BaseFormControlComponent, provideControlValueAccessor } from "../base-form-control.component";

@Component({
  selector: 'app-text-control',
  templateUrl: './text-control.component.html',
  providers: [provideControlValueAccessor(TextControlComponent)]
})
export class TextControlComponent extends BaseFormControlComponent<string>{

}
