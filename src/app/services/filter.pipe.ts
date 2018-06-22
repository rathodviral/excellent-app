import {Pipe, PipeTransform} from '@angular/core';
import {Utilities} from "../shared/services/utilities";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(i:any[], f:any):any {
    if (!i || !f) {
      return i;
    }

    if (f.name === undefined) {
      return i;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return i.filter(item => item.filterValueName.toLowerCase().indexOf(f.name.toLowerCase()) !== -1);
  }

}
