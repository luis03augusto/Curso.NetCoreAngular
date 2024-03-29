import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from 'src/app/util/Constants';

@Pipe({
  name: 'DateTimeFormatePipe'
})
export class DateTimeFormatePipePipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(value, Constants.DATE_TIME_FMT);
  }

}
