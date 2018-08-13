import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bookfilter',
    pure: false
})

export class FilterDeepDataPipe implements PipeTransform {
    transform(items: any[], filter: any): any[] {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item: any) => this.applyFilter(item, filter));
    }

    applyFilter(any: any, filter: any): boolean {
        for (const field in filter) {
            if (filter[field]) {
                if (typeof filter[field] === 'string') {
                    if (any[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
                        return false;
                    }
                } else if (typeof filter[field] === 'number') {
                    if (any[field] !== filter[field]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}