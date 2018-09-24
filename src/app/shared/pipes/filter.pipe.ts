import { Pipe, PipeTransform } from '@angular/core';
import { Utilities } from '../services/utilities';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(i: any[], f: any): any {
    if (!i || !f) {
      return i;
    }

    if (!Utilities.isEmptyObj(f.name)) {
      return i.filter(item => item.filterValueName.toLowerCase().indexOf(f.name.toLowerCase()) !== -1);
    }

    if (!Utilities.isEmptyObj(f.optionName)) {
      return i.filter(item => item.optionName.toLowerCase().indexOf(f.optionName.toLowerCase()) !== -1);
    }

    if (!Utilities.isEmptyObj(f.zoneName)) {
      return i.filter(item => item.zoneName.toLowerCase().indexOf(f.zoneName.toLowerCase()) !== -1);
    }

    return i;
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
  }

}
