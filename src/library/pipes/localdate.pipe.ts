import { Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'localdate'})
export class LocalDatePipe extends DatePipe {
  transform(value: any, pattern: string = 'Australia/Sydney'): string|null {
    let datestr = super.transform(value, 'yyyy-MM-dd hh:mm:ss');
    if (datestr == null) {
      return null;
    }
    datestr = datestr + ' GMT+0000';
    let date = new Date(datestr);
    return date.toLocaleString('en-au', {timeZone:pattern});
  }
}