import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { Utilities } from 'src/app/shared/services/utilities';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DynamicPriceOptionsService } from 'src/app/shared/components/dynamic-price-options/dynamic-price-options.service';
import { PriceOptions } from '../../shared/components/dynamic-price-options/dynamic-price-options';
import { FromControlTypes } from '../../shared/constant/form-control';
import * as _ from 'lodash';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalStorage } from '../../shared/constant/local-storage';

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
    private commonService: CommonService,
    private dynamicPriceOptionsService: DynamicPriceOptionsService) { }

  private filterProductOptionData() {
    this.addToCartData.forEach((v, k) => {
      if (!Utilities.isEmptyObj(v['productOption']['rjmentions'])) {
        v['displayPrice'] = 0;
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
        });
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

  changeInProductPriceTextbox(event, data, product) { }

  changeInProductPriceSelect(event, variant, product) {
    const otherPrice = product.productOption.optionPrice.otherPrice;
    let variants = [];
    product.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });

    otherPrice.forEach(x => {
      if (this.isArrayEqual(x.varCobination, variants)) {
        product['displayPrice'] = x.price;
      }
    });
  }

  bulkChangeInProductPriceTextbox(event, data) {
    this.addToCartData.forEach(product => {
      product.productOption.priceUnit.forEach(price => {
        price.value = data.value;
      });
    });
  }

  bulkChangeInProductPriceSelect(event, data) {
    this.addToCartData.forEach(product => {
      product.productOption.variant.forEach(variant => {
        if (variant.name === data.name) {
          variant.value = data.value;
        }
      });
      this.changeInProductPriceSelect(event, null, product);
    });
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
    this.commonService.setLocalStorageObject(LocalStorage.CartData, this.addToCartData);
  }

  isArrayEqual(x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
