import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeToBytes',
})
export class SizeToBytesPipe implements PipeTransform {

  transform(size: string | undefined): string {
    const sizeInMB = (parseInt(size || "0") / (1024*1024)).toFixed(2);
    return `${sizeInMB}MB`;
  }
}
