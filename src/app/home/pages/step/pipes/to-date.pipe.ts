import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate',
})
export class ToDatePipe implements PipeTransform {

  transform(date: string | Date | undefined | null): Date {
    if (!date) {
      return new Date();
    }

    if (typeof date === 'string') {
      return new Date(date);
    }
    return date;
  }
}
