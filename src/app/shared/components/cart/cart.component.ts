import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { FormControlTypes } from '../../constant/form-control';
import { AppService } from '../../../app.service';
import { CommonService } from '../../services/common.service';
import { DynamicPriceOptionsService } from '../dynamic-price-options/dynamic-price-options.service';
import { Router } from '@angular/router';
import { Utilities } from '../../services/utilities';
import { LocalStorage } from '../../constant/local-storage';

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

  @Output('closeCart') closeCart = new EventEmitter<boolean>();

  constructor(
    private servicesService: AppService,
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
            max: (price['unitMax'] === 0 || price['unitMax'] === null) ? 99999 : price['unitMax'],
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
        if (!Utilities.isEmptyObj(v['productOption']['priceUnit'])) {
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
        }
        v['productOption']['variant'] = variantData;
      }
    });
  }

  private getLocalStorageData() {
    const oldData = this.commonService.getLocalStorageObject(LocalStorage.CartData) || [];
    this.storageCartData = oldData;
    this.selectedData.name = `Radio Campaign ${this.storageCartData.length + 1}`;

  }

  ngOnInit() {
    this.getLocalStorageData();
    this.subscription = this.servicesService.getCartData().subscribe(x => {
      if (!Utilities.isEmptyObj(x.data) && x.data.every(y => !Utilities.isEmptyObj(y['productOption'][Object.keys(y['productOption'])[0]]))) {
        this.getLocalStorageData();
        this.addToCartDataDefault = _.cloneDeep(x.data);
        this.addToCartData = _.cloneDeep(x.data);
        this.filterProductOptionData();

        this.bulkChangeInProductPrice(event);
        // this.commonService.printToaster(false, 'Cart updated');

      } else {
        this.addToCartData = [];
        this.bulkCartData = [];
        this.commonService.printToaster('warning', 'Current option type have no enough data, please select another one.');
      }
    });

    this.isSelectIndividualTab = false;
  }

  changeInProductPriceTextbox(event, data, product) {
    this.changeInProductPriceSelect(event, data, product);
  }

  changeInProductPriceSelect(event, variant, product) {
    const otherPrice = _.orderBy(product.productOption.optionPrice.otherPrice, ['minQty'], ['asc']);
    const qtyList = product.productOption.priceUnit;
    const qtyData = this.commonService.multiplyArrayObj(qtyList);

    let variants = [];

    if (!Utilities.isEmptyObj(product.productOption.variant)) {
      product.productOption.variant.forEach(element => {
        variants.push({ field: element.name, value: element.value });
      });
    }

    const qtyrange = _.uniq(otherPrice.map(x => x.minQty));

    for (let index = 0; index < otherPrice.length; index++) {
      const x = otherPrice[index].minQty;
      const z = otherPrice[index];

      const rangeIndex = qtyrange.findIndex(p => p === otherPrice[index].minQty);
      if (x === qtyrange[rangeIndex]) {
        otherPrice[index].maxQty = Utilities.isEmptyObj(qtyrange[rangeIndex + 1]) ? 99999 : (qtyrange[rangeIndex + 1] - 1);
      }
      const y = otherPrice[index].maxQty;
      if (this.commonService.isArrayEqual(z.varCobination, variants)) {
        if (x <= qtyData && y >= qtyData) {
          product['displayPrice'] = z.price;
          product.productOption['optPrice'] = z.price;
        }
      }
    }

    product.productOption['totalPrice'] = product.productOption['optPrice'] * qtyData;

  }

  bulkChangeInProductPrice(event) {
    this.bulkCartData.productOption.variant.forEach(variant => {
      this.bulkChangeInProductPriceSelect(event, variant);
    });

    this.bulkCartData.productOption.priceUnit.forEach(price => {
      this.bulkChangeInProductPriceTextbox(event, price);
    });
  }

  bulkChangeInProductPriceTextbox(event, data) {
    this.addToCartData.forEach(product => {
      product.productOption.priceUnit.forEach(price => {
        if (price.key === data.key) {
          price.value = data.value;
        }
      });
      this.changeInProductPriceSelect(event, null, product);
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
      if (!Utilities.isEmptyObj(element['productOption']['priceUnit'])) {
        // totalAmt = element['displayPrice'];
        // element['productOption']['priceUnit'].forEach(product => {
        //   qtyData = qtyData * product.value;
        // });

        total = total + element['productOption']['totalPrice'];
      }

    });

    return total;
  }

  saveCartData() {
    this.selectedData.product = _.cloneDeep(this.addToCartDataDefault);
    this.selectedData.totalPrice = this.displayTotalPrice();
    this.selectedData.product.forEach(element => {
      let cartdata = this.addToCartData.find(x => x.alias === element.alias)['productOption'];
      element['productOption']['optionPrice'] = cartdata['optPrice'];
      element['productOption']['subTotalPrice'] = cartdata['totalPrice'];
      element['productOption']['selectedOption'] = {
        priceUnit:[],
        variant:[]
      };

      const data = element['productOption'][Object.keys(element['productOption'])[0]];

      if (!Utilities.isEmptyObj(data.priceUnit)) {
        data.priceUnit.forEach(p => {
          const index = cartdata.priceUnit.findIndex(x => x.name === p.unitName);
          if (index > -1) {
            p['value'] = cartdata.priceUnit[index].value;
            element['productOption']['selectedOption']['priceUnit'].push({name:cartdata.priceUnit[index].name,value:cartdata.priceUnit[index].value});
          }
        });
      }

      if (!Utilities.isEmptyObj(data.variant)) {
        data.variant.forEach(v => {
          const index = cartdata.variant.findIndex(x => x.name === v.name);
          if (index > -1) {
            v.value = cartdata.variant[index].value;
            element['productOption']['selectedOption']['variant'].push({name:cartdata.variant[index].name,value:cartdata.variant[index].value});
          }
        });
      }
    });
    this.storageCartData.push(this.selectedData);
    this.commonService.clearLocalStorageObject(LocalStorage.CartData);
    this.commonService.setLocalStorageObject(LocalStorage.CartData, this.storageCartData);
    this.closeCart.emit(false);
    this.storageCartData = [];
    this.addToCartDataDefault = [];
    this.addToCartData = [];
    this.router.navigate(['/media']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
