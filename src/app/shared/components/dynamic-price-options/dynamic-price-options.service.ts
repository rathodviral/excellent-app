import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PriceOptions } from './dynamic-price-options';
import { Utilities } from '../../services/utilities';


@Injectable()
export class DynamicPriceOptionsService {

    constructor() { }

    getPriceOptions(options) {

        let priceOptions: PriceOptions<any>[] = [];

        options.forEach((option, index) => {
            option['order'] = index + 1;
            priceOptions.push(new PriceOptions(option));
        });

        return this.toFormGroup(priceOptions.sort((a, b) => a.order - b.order));
    }

    toFormGroup(pOptions: PriceOptions<any>[]) {
        let group: any = {};

        pOptions.forEach(item => {
            if (Utilities.isEmptyObj(item.validation)) {
                group[item.key] = new FormControl(item.value || '');
            } else {
                group[item.key] = new FormControl(item.value || '', item.validation);
            }
        });
        return new FormGroup(group);
    }
}
