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
  storageCartData: any;
  bulkCartData: any = {};
  filterObj = {
    campaignName: ''
  };
  selectedData = {
    campaignName: '',
    cartData: []
  };

  isSelectIndividualTab: boolean;
  orderForm: FormGroup;
  priceOptions: any[] = [];
  priceOptionKey: string;
  formControlTypes = FromControlTypes;
  displayPrice: string = null;

  constructor(
    private servicesService: ServicesService,
    private commonService: CommonService,
    private dynamicPriceOptionsService: DynamicPriceOptionsService) { }

  private filterProductOptionData() {
    this.addToCartData.forEach((v, k) => {
      if (!Utilities.isEmptyObj(v['productOption'][this.priceOptionKey])) {
        v['displayPrice'] = 0;
        v['productOption'] = v['productOption'][this.priceOptionKey];
        let priceData = [];
        v['productOption']['priceUnit'].forEach(price => {
          priceData.push({
            key: price['unitName'].toLowerCase(),
            placeholder: price['unitName'],
            code: price['unitCode'],
            max: (price['unitMax'] === 0 || price['unitMax'] === null) ? 999 : price['unitMax'],
            min: price['unitMin'],
            name: price['unitName'],
            step: price['unitStep'],
            type: price['unitType'].toLowerCase(),
            value: price['unitMin'] > 1 ? price['unitMin'] : 1,
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
    this.storageCartData = this.commonService.getLocalStorageObject(LocalStorage.CartData);
    this.subscription = this.servicesService.getCartData().subscribe(x => {
      if (!Utilities.isEmptyObj(x)) {
        this.priceOptionKey = x.key;
        this.addToCartData = x.data;
        this.filterProductOptionData();
        this.bulkChangeInProductPriceSelect(null, this.bulkCartData.productOption.optionPrice.defaultPrice.varCobination);
      }
    });

    this.selectedData.campaignName = 'Campaign 1';
    if (!Utilities.isEmptyObj(this.storageCartData)) {
      this.selectedData = this.storageCartData;
      this.addToCartData = this.storageCartData.cartData;
      this.bulkCartData = this.addToCartData[0];
    }
    this.isSelectIndividualTab = false;
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

  showProductPrice(product) {
    let display = 0;
    const otherPrice = product.productOption.optionPrice.otherPrice;
    let variants = [];
    product.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });

    otherPrice.forEach(x => {
      if (this.isArrayEqual(x.varCobination, variants)) {
        display = x.price;
      }
    });

    return display;
  }

  bulkChangeInProductPriceTextbox(event, data) {
    this.addToCartData.forEach(product => {
      product.productOption.priceUnit.forEach(price => {
        if (price.key === data.key) {
          price.value = data.value;
        }
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
    this.selectedData.cartData = this.addToCartData;
    this.commonService.setLocalStorageObject(LocalStorage.CartData, this.selectedData);
  }

  isArrayEqual(x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
