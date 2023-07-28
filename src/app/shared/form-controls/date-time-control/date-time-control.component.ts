import { Component } from '@angular/core';
import { BaseFormControlComponent, provideControlValueAccessor } from "../base-form-control.component";
import { map } from "rxjs/operators";
import { NgbTimepickerConfig, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";

@Component({
  selector: 'app-date-time-control',
  templateUrl: './date-time-control.component.html',
  providers: [provideControlValueAccessor(DateTimeControlComponent), NgbTimepickerConfig]
})
export class DateTimeControlComponent extends BaseFormControlComponent<Date>{

  constructor(config: NgbTimepickerConfig) {
    super();
    // customize default values of ratings used by this component tree
    config.spinners = false;
  }


  time$: Observable<NgbTimeStruct> = this.value$.pipe(
    map((date: Date | null | undefined) => {
      if (!date) {
        date = new Date();
      }

      return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: 0
      };
    })
  );

  handleDateChange(event: Date) {
    super.handleModelChange(event);
  }

  handleTimeChange(event: NgbTimeStruct) {
    const date: Date | null | undefined = this.value$.getValue();
    date?.setHours(event.hour);
    date?.setMinutes(event.minute);
    if (date) {
      super.handleModelChange(new Date(date.getTime()));
    }
  }

}
