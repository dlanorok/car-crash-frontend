import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includes',
})
export class IncludesPipe implements PipeTransform {
  transform<T>(arr: T[] | null | undefined, item: T): boolean {
    if (!Array.isArray(arr)) {
      return false;
    }
    return arr.includes(item);
  }
}
