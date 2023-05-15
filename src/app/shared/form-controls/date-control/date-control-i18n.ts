import { Injectable } from "@angular/core";
import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TranslocoService } from "@ngneat/transloco";

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private translocoService: TranslocoService) {
    super();
  }

  getWeekdayLabel(weekday: number): string {
    return this.translocoService.translate(`car-crash.date-picker.weekday.${weekday-1}`)
  }

  override getWeekLabel(): string {
    return this.translocoService.translate(`car-crash.date-picker.weekday.week-label`)
  }

  getMonthShortName(month: number): string {
    return this.translocoService.translate(`car-crash.date-picker.month.${month-1}`)
  }

  getMonthFullName(month: number): string {
    return this.translocoService.translate(`car-crash.date-picker.month-full.${month-1}`)
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
