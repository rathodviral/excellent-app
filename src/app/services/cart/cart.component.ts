import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { Utilities } from 'src/app/shared/services/utilities';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DynamicPriceOptionsService } from 'src/app/shared/components/dynamic-price-options/dynamic-price-options.service';
import { PriceOptions } from '../../shared/components/dynamic-price-options/dynamic-price-options';
import * as _ from 'lodash';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalStorage } from '../../shared/constant/local-storage';
import { Router } from '../../../../node_modules/@angular/router';
import { FormControlTypes } from 'src/app/shared/constant/form-control';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  addToCartData: any[] = [];
  addToCartDataDefault: any[] = [];
  storageCartData: any[];
  bulkCartData: any = {};
  filterObj = {
    campaignName: ''
  };
  selectedData = {
    name: '',
    product: [],
    totalPrice: 0
  };

  isSelectIndividualTab: boolean;
  orderForm: FormGroup;
  priceOptions: any[] = [];
  // priceOptionKey: string;
  formControlTypes = FormControlTypes;
  displayPrice: string = null;

  constructor(
    private servicesService: ServicesService,
    private commonService: CommonService,
    private dynamicPriceOptionsService: DynamicPriceOptionsService,
    private router: Router) { }

  private filterProductOptionData() {
    this.bulkCartData = _.cloneDeep(this.addToCartData[0]);
    this.bulkCartData['productOption']['priceUnit'] = [];
    this.bulkCartData['productOption']['variant'] = [];

    this.addToCartData.forEach((v, k) => {
      if (!Utilities.isEmptyObj(v['productOption'][Object.keys(v['productOption'])[0]])) {
        v['displayPrice'] = 0;
        v['productOption'] = v['productOption'][Object.keys(v['productOption'])[0]];
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
          if (!this.bulkCartData['productOption']['priceUnit'].some(x => x.key === price['unitName'].toLowerCase())) {
            this.bulkCartData['productOption']['priceUnit'].push({
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
          }
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

          if (!this.bulkCartData['productOption']['variant'].some(x => x.key === variant['name'].toLowerCase())) {
            this.bulkCartData['productOption']['variant'].push({
              key: variant['name'].toLowerCase(),
              name: variant['name'],
              placeholder: 'Select Variant',
              controlType: this.formControlTypes.Select,
              value: variant['defaultValue'] || null,
              options: variant['variantValue']
            });
          }
        });

        v['productOption']['variant'] = variantData;
      }
    });
  }

  private bulkChangeInProductPriceTextbox(event, data) {
    this.addToCartData.forEach(product => {
      product.productOption.priceUnit.forEach(price => {
        if (price.key === data.key) {
          price.value = data.value;
        }
      });
    });
  }

  private bulkChangeInProductPriceSelect(event, data) {
    this.addToCartData.forEach(product => {
      product.productOption.variant.forEach(variant => {
        if (variant.name === data.name) {
          variant.value = data.value;
        }
      });
      this.changeInProductPriceSelect(event, null, product);
    });
  }

  ngOnInit() {
    const oldData = this.commonService.getLocalStorageObject(LocalStorage.CartData) || [];
    this.storageCartData = oldData;
    this.subscription = this.servicesService.getCartData().subscribe(x => {
      if (!Utilities.isEmptyObj(x.data)) {

        this.addToCartDataDefault = _.cloneDeep(x.data);
        // this.priceOptionKey = x.key;
        this.addToCartData = _.cloneDeep(x.data);
        this.filterProductOptionData();

        this.bulkChangeInProductPriceSelect(null, this.addToCartData[0].productOption.optionPrice.defaultPrice.varCobination);
      } else {
        this.addToCartData = [];
        this.bulkCartData = [];
      }
    });

    this.selectedData.name = `Radio Campaign ${this.storageCartData.length + 1}`;
    // if (!Utilities.isEmptyObj(this.storageCartData)) {
    //   this.selectedData = this.storageCartData;
    //   this.addToCartData = this.storageCartData.cartData;
    //   this.bulkCartData = this.addToCartData[0];
    // }
    this.isSelectIndividualTab = false;
  }

  changeInProductPriceTextbox(event, data, product) {
    this.changeInProductPriceSelect(event, null, product);
  }

  changeInProductPriceSelect(event, variant, product) {
    const otherPrice = product.productOption.optionPrice.otherPrice;
    const qtyList = product.productOption.priceUnit;
    const qtyData = this.commonService.multiplyArrayObj(qtyList);

    let variants = [];
    product.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });

    otherPrice.forEach(x => {
      if (this.commonService.isArrayEqual(x.varCobination, variants) && x.minQty === qtyData) {
        product['displayPrice'] = x.price;
      } else if (this.commonService.isArrayEqual(x.varCobination, variants) && x.minQty === 1) {
        product['displayPrice'] = x.price;
      }
    });

    this.showProductPrice(product);

  }

  showProductPrice(product) {
    const otherPrice = product.productOption.optionPrice.otherPrice;
    const qtyList = product.productOption.priceUnit;
    const qtyData = this.commonService.multiplyArrayObj(qtyList);

    let variants = [];
    product.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });

    otherPrice.forEach(x => {

      if (this.commonService.isArrayEqual(x.varCobination, variants)) {

        if (x.minQty === qtyData) {
          product.productOption['optPrice'] = x.price;
          product.productOption['totalPrice'] = x.price * qtyData || 0;

        } /* else if (x.minQty === 1 && this.display === 0) {
          this.display = x.price;
          // product.productOption['optionPrice'] = x.price;
          product.productOption['totalPrice'] = x.price * qtyData;

        } */
      }
    });

  }



  bulkChangeInProductPrice(event) {
    this.bulkCartData.productOption.variant.forEach(variant => {
      this.bulkChangeInProductPriceSelect(event, variant);
    });

    this.bulkCartData.productOption.priceUnit.forEach(price => {
      this.bulkChangeInProductPriceTextbox(event, price);
    });
  }


  displayTotalPrice() {
    let total = 0;

    this.addToCartData.forEach(element => {
      if (!Utilities.isEmptyObj(element['productOption']['priceUnit'])) {
        total = total + element['displayPrice'];
        element['productOption']['priceUnit'].forEach(product => {
          total = total * product.value;
        });
      }
    });

    return total;
  }

  saveCartData() {
    this.selectedData.product = _.cloneDeep(this.addToCartDataDefault);
    this.selectedData.totalPrice = this.displayTotalPrice();
    this.selectedData.product.forEach(element => {
      let data = this.addToCartData.find(x => x.alias === element.alias);
      element['productOption']['optionPrice'] = data['productOption']['optPrice'];
      element['productOption']['totalPrice'] = data['productOption']['totalPrice'];
    });
    this.storageCartData.push(this.selectedData);
    this.commonService.setLocalStorageObject(LocalStorage.CartData, this.storageCartData);
    this.router.navigate(['services/media']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
