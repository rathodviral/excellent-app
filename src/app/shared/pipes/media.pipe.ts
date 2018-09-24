import { Pipe, PipeTransform } from '@angular/core';
import { Utilities } from '../services/utilities';

@Pipe({
    name: 'media'
})
export class MediaPipe implements PipeTransform {

    transform(items: any[], filters: any): any {
        if (!items || !filters) {
            return items;
        }

        if (!Utilities.isEmptyObj(filters.group)) {
            return items.filter(item => item.group.toLowerCase().indexOf(filters.group.toLowerCase()) !== -1);
        }

        return items;
    }

}
