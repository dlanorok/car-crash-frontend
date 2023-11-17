import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'asAsync$',
})
export class AsAsync$Pipe implements PipeTransform {
  transform<T>(value: T | Observable<T>): Observable<T> {
    if (value instanceof Observable) {
      return value;
    }
    return of(value);
  }
}
