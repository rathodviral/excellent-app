import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../services.service';
import * as _ from 'lodash';
import { FormControlTypes } from 'src/app/shared/constant/form-control';
import { CommonService } from 'src/app/shared/services/common.service';
import { Utilities } from '../../shared/services/utilities';
import { LocalStorage } from 'src/app/shared/constant/local-storage';

declare var jQuery;

@Component({
  selector: 'app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.css']
})
export class MediaDetailComponent implements OnInit {

  page: string;
  alias: string;
  mediaDetail: any;
  productOptions: any[];
  productOption: any;
  productOptionDefault: any;
  detailTab: string;
  formControlTypes = FormControlTypes;
  display: number;
  isPricingOptionDisplay: boolean;
  selectedData = {
    product: [],
    totalPrice: 0,
    name: ''
  };
  storageCartData: any[];
  scrollElem: string;

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private router: Router,
    private commonService: CommonService) {

    this.route.params.subscribe((x) => {
      this.alias = x['alias'] || null;
    });

    this.route.url.subscribe((x) => {
      this.page = x[0]['path'] || null;
    });

  }

  ngOnInit() {
    const oldData = this.commonService.getLocalStorageObject(LocalStorage.CartData) || [];
    this.storageCartData = oldData;
    this.detailTab = 'overview';
    this.scrollElem = 'advertising-rate';
    this.productOptions = [];
    this.productOption = {};
    this.isPricingOptionDisplay = false;
    this.servicesService.getMediaDetail(this.page, this.alias).subscribe((response) => {
      this.mediaDetail = _.cloneDeep(response);
      this.mediaDetail['metaData'] = JSON.parse(response['metaData']);
      this.mediaDetail['specification'].forEach(element => {
        element['additionalInfo'] = JSON.parse(element['additionalInfo']);
      });
      // console.log(this.mediaDetail);
      for (const key in this.mediaDetail.productOption) {
        if (this.mediaDetail.productOption.hasOwnProperty(key)) {
          const element = this.mediaDetail.productOption[key];
          this.productOptions.push(element);
        }
      }
      // console.log(_.values(_.groupBy(this.productOptions, 'optionSection')));
      // console.log(_.map(_.keyBy(this.productOption, 'optionSection')));
    });

    this.selectedData.name = `Radio Campaign ${oldData.length + 1}`;
  }

  filterProductOptionData(v) {
    console.log(v);
    this.isPricingOptionDisplay = true;

    if (Utilities.isEmptyObj(v['priceUnit'])) {
      return;
    }

    if (Utilities.isEmptyObj(v['variant'])) {
      return;
    }

    this.productOption = _.cloneDeep(v);
    this.selectedData.product = _.cloneDeep(v);
    this.productOption['displayPrice'] = 0;
    // v['productOption'] = v['productOption'][this.priceOptionKey];
    let priceData = [];
    this.productOption['priceUnit'].forEach(price => {
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
    this.productOption['priceUnit'] = priceData;

    let variantData = [];
    this.productOption['variant'].forEach(variant => {
      variantData.push({
        key: variant['name'].toLowerCase(),
        name: variant['name'],
        placeholder: 'Select Variant',
        controlType: this.formControlTypes.Select,
        value: variant['defaultValue'] || null,
        options: variant['variantValue']
      });
    });

    this.productOption['variant'] = variantData;
    this.changeInProductPriceSelect();

  }

  changeInProductPriceTextbox() {
    // this.changeInProductPriceSelect(event, null, product);
  }

  changeInProductPriceSelect() {
    const otherPrice = this.productOption.optionPrice.otherPrice;
    const qtyList = this.productOption.priceUnit;
    const qtyData = this.commonService.multiplyArrayObj(qtyList);

    let variants = [];
    this.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });

    otherPrice.forEach(x => {
      if (this.commonService.isArrayEqual(x.varCobination, variants) && x.minQty === qtyData) {
        this.productOption['displayPrice'] = x.price;
      } else if (this.commonService.isArrayEqual(x.varCobination, variants) && x.minQty === 1) {
        this.productOption['displayPrice'] = x.price;
      }
    });


    this.showProductPrice();

  }

  showProductPrice() {
    this.display = 0;
    const otherPrice = this.productOption.optionPrice.otherPrice;
    const qtyList = this.productOption.priceUnit;
    const qtyData = this.commonService.multiplyArrayObj(qtyList);


    let variants = [];
    this.productOption.variant.forEach(element => {
      variants.push({ field: element.name, value: element.value });
    });

    otherPrice.forEach(x => {
      if (this.commonService.isArrayEqual(x.varCobination, variants)) {
        if (x.minQty === qtyData) {
          this.display = x.price;
          // this.productOption['optionPrice'] = x.price;
          this.productOption['totalPrice'] = x.price * qtyData;

        } else if (x.minQty === 1 && this.display === 0) {
          this.display = x.price;
          // this.productOption['optionPrice'] = x.price;
          this.productOption['totalPrice'] = x.price * qtyData;

        }
      }
    });
  }

  displayTotalPrice() {
    if (Utilities.isEmptyObj(this.productOption['displayPrice'])) {
      return 0;
    }

    let total = 0;

    total = total + this.productOption['displayPrice'];
    this.productOption['priceUnit'].forEach(product => {
      total = total * product.value;
    });

    return total;
  }

  saveDetail() {

    this.selectedData.product['displayPrice'] = this.productOption['displayPrice'];
    this.selectedData.product['optionPrice'] = this.productOption['displayPrice'];
    this.selectedData.product['totalPrice'] = this.productOption['totalPrice'];

    this.selectedData.totalPrice = this.displayTotalPrice();
    this.storageCartData.push(this.selectedData);
    this.commonService.setLocalStorageObject(LocalStorage.CartData, this.storageCartData);
    this.router.navigate(['services/media']);
  }

  scrollToElement(elem) {
    this.scrollElem = elem;
    const element = document.querySelector('#' + elem);
    element.scrollIntoView({ behavior: 'smooth' });
  }

}
