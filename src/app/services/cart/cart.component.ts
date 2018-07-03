import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { Utilities } from 'src/app/shared/services/utilities';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DynamicPriceOptionsService } from 'src/app/shared/components/dynamic-price-options/dynamic-price-options.service';
import { PriceOptions } from '../../shared/components/dynamic-price-options/dynamic-price-options';
import { FromControlTypes } from '../../shared/constant/form-control';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  addToCartData: any[] = [];
  bulkCartData: any = {};
  filterObj = {
    campaignName: ''
  };
  selectedData = {
    campaignName: ''
  };

  isSelectIndividualTab = false;
  orderForm: FormGroup;
  priceOptions: any[] = [];
  formControlTypes = FromControlTypes;
  displayPrice: string = null;

  constructor(
    private servicesService: ServicesService,
    private dynamicPriceOptionsService: DynamicPriceOptionsService) { }

  private filterProductOptionData() {
    this.addToCartData.forEach((v, k) => {
      // delete v['productOption'];
      // if (v['productOption'].length > 0) {
      if (!Utilities.isEmptyObj(v['productOption']['rjmentions'])) {
        v['displayPrice'] = 0;
        // v['productOption'] = v['productOption'].find(x => x['rjmentions'])['rjmentions'];
        v['productOption'] = v['productOption']['rjmentions'];
        let priceData = [];
        v['productOption']['priceUnit'].forEach(price => {
          priceData.push({
            key: price['unitName'].toLowerCase(),
            placeholder: price['unitName'],
            code: price['unitCode'],
            max: price['unitMax'],
            min: price['unitMin'],
            name: price['unitName'],
            step: price['unitStep'],
            type: price['unitType'].toLowerCase(),
            value: 1,
            controlType: this.formControlTypes.Text
          });


          // priceData.push(new PriceOptions({
          //   key: price['unitName'].toLowerCase(),
          //   label: price['unitName'],
          //   step: price['unitStep'],
          //   controlType: price['unitType'] === 'number' ? FromControlTypes.Text : FromControlTypes.Select,
          //   type: price['unitType'],
          //   placeholder: price['unitName'],
          //   max: price['unitMax'],
          //   min: price['unitMin']
          // }));

        });


        // v['productOption']['priceUnit'] = this.dynamicPriceOptionsService.getPriceOptions(priceData);
        v['productOption']['priceUnit'] = priceData;

        let variantData = [];
        v['productOption']['variant'].forEach(variant => {
          variantData.push({
            key: variant['name'].toLowerCase(),
            name: variant['name'],
            placeholder: 'Select Variant',
            controlType: this.formControlTypes.Select,
            value: variant['defaultValue'] || null,
            options: variant['variantValue']
          });
        });

        v['productOption']['variant'] = variantData;
      }

    });

    this.bulkCartData = this.addToCartData[0];
  }

  ngOnInit() {
    this.subscription = this.servicesService.getCartData().subscribe(x => {
      if (!Utilities.isEmptyObj(x)) {
        this.addToCartData = x;
        this.filterProductOptionData();
      }
    });
    this.selectedData.campaignName = 'Radio Campaign';
  }

  changeInProductPriceTextbox(event, data, product) {
    // product['displayPrice'] = product['displayPrice'] * data.value;

  }
  changeInProductPriceSelect(event, variant, product) {
    const otherPrice = product.productOption.optionPrice.otherPrice;
    let variants = [];
    product.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });
    // const variants = product.productOption.variant.map(x => x.name === variant.name ? variant : x);
    console.log(variants);

    // product['displayPrice'] = otherPrice.find(x => (x.variantId1 === variant.name && x.variantValueId1 === variant.value))['price'];
    // varCombination

    // product['displayPrice'] = otherPrice.find(x => x.varCobination.some(y => y.field === variant.name && y.value === variant.value))['price'];
    // product['displayPrice'] = otherPrice.find(x => x.varCobination.some(y => variants.some(z => z.name === y.field && z.value === y.value)))['price'];
    otherPrice.forEach(x => {
      if (this.isArrayEqual(x.varCobination, variants)) {
        product['displayPrice'] = x.price;
      }
    });

    // console.log(otherPrice.find(x => x.varCobination.some(y => variants.some(z => z.name === y.field && z.value === y.value)))['price']);

  }

  displayTotalPrice() {
    let total = 0;

    this.addToCartData.forEach(element => {
      total = total + element['displayPrice'];
      element['productOption']['priceUnit'].forEach(product => {
        total = total * product.value;
      });
    });

    return total;
  }

  saveCartData() {

  }

  isArrayEqual(x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
