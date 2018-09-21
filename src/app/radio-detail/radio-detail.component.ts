import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControlTypes } from '../shared/constant/form-control';
import { MatSidenav, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { CommonService } from '../shared/services/common.service';
import { LocalStorage } from '../shared/constant/local-storage';
import { Utilities } from '../shared/services/utilities';
import * as _ from 'lodash';
import { LoginPopupComponent } from '../shared/components/login-popup/login-popup.component';

@Component({
  selector: 'app-radio-detail',
  templateUrl: './radio-detail.component.html',
  styleUrls: ['./radio-detail.component.css']
})
export class RadioDetailComponent implements OnInit {

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
  isLoginPopupDisplay: boolean;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private router: Router,
    private commonService: CommonService,
    public dialog: MatDialog) {

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
    this.sidenav.close();
    this.servicesService.getMediaDetail(this.page, this.alias).subscribe((response) => {
      this.mediaDetail = response;
      // this.mediaDetail['metaData'] = JSON.parse(response['metaData']);
      // this.mediaDetail['specification'].forEach(element => {
      //   element['additionalInfo'] = JSON.parse(element['additionalInfo']);
      // });
      for (const key in this.mediaDetail.productOption) {
        if (this.mediaDetail.productOption.hasOwnProperty(key)) {
          const element = this.mediaDetail.productOption[key];
          this.productOptions.push(element);
        }
      }
      // console.log(_.values(_.groupBy(this.productOptions, 'optionSection')));
      // console.log(_.map(_.keyBy(this.productOption, 'optionSection')));
    });
    /* if (this.transferState.hasKey(STATE_KEY_USERS)) {
      this.mediaDetail = this.transferState.get(STATE_KEY_USERS, {});
      this.transferState.remove(STATE_KEY_USERS);
    } else {
      // this.route.data.subscribe(({ detail }) => {
      //   this.mediaDetail = _.cloneDeep(detail);
      //   this.transferState.set(myTransferStateKey, this.mediaDetail);

      //   for (const key in this.mediaDetail.productOption) {
      //     if (this.mediaDetail.productOption.hasOwnProperty(key)) {
      //       const element = this.mediaDetail.productOption[key];
      //       this.productOptions.push(element);
      //     }
      //   }

      // });
      this.servicesService.getMediaDetail(this.page, this.alias).subscribe((response) => {
        this.mediaDetail = response;
        this.transferState.set(STATE_KEY_USERS, this.mediaDetail);
        for (const key in this.mediaDetail.productOption) {
          if (this.mediaDetail.productOption.hasOwnProperty(key)) {
            const element = this.mediaDetail.productOption[key];
            this.productOptions.push(element);
          }
        }
      });
    } */

    /* this.route.data.subscribe(({ detail }) => {
      this.mediaDetail = _.cloneDeep(detail);
      for (const key in this.mediaDetail.productOption) {
        if (this.mediaDetail.productOption.hasOwnProperty(key)) {
          const element = this.mediaDetail.productOption[key];
          this.productOptions.push(element);
        }
      }

    }); */


    this.selectedData.name = `Radio Campaign ${oldData.length + 1}`;
  }

  filterProductOptionData(v) {
    this.isPricingOptionDisplay = true;
    this.sidenav.open();

    if (Utilities.isEmptyObj(v['priceUnit'])) {
      return;
    }

    // if (Utilities.isEmptyObj(v['variant'])) {
    //   return;
    // }

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

    if (!Utilities.isEmptyObj(v['variant'])) {
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
    }

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
    if (!Utilities.isEmptyObj(this.productOption.variant)) {
      this.productOption.variant.forEach(element => {

        variants.push({ field: element.name, value: element.value });
      });
    }

    const qtyrange = _.uniq(otherPrice.map(x => x.minQty)) || [];

    for (let index = 0; index < otherPrice.length; index++) {
      const x = otherPrice[index].minQty;
      const z = otherPrice[index];

      const rangeIndex = qtyrange.findIndex(p => p === otherPrice[index].minQty);
      if (x === qtyrange[rangeIndex]) {
        otherPrice[index].maxQty = Utilities.isEmptyObj(qtyrange[rangeIndex + 1]) ? 99999 : (Number(qtyrange[rangeIndex + 1]) - 1);
      }
      const y = otherPrice[index].maxQty;
      if (this.commonService.isArrayEqual(z.varCobination, variants)) {
        if (x <= qtyData && y >= qtyData) {
          this.productOption['displayPrice'] = z.price;
          this.productOption['optPrice'] = z.price;
        }
      }
    }

    this.productOption['totalPrice'] = this.productOption['optPrice'] * qtyData;

  }


  displayTotalPrice() {
    if (Utilities.isEmptyObj(this.productOption['displayPrice'])) {
      return 0;
    }

    let total = 0;

    // total = total + this.productOption['displayPrice'];
    // this.productOption['priceUnit'].forEach(product => {
    //   total = total * product.value;
    // });


    total = total + this.productOption['totalPrice'];
    return total;
  }

  saveDetail() {

    this.selectedData.product['displayPrice'] = this.productOption['displayPrice'];
    this.selectedData.product['optionPrice'] = this.productOption['displayPrice'];
    this.selectedData.product['totalPrice'] = this.productOption['totalPrice'];
    console.log(this.selectedData);

    if (!Utilities.isEmptyObj(this.selectedData.product['priceUnit'])) {
      this.selectedData.product['priceUnit'].forEach(p => {
        const index = this.productOption.priceUnit.findIndex(x => x.name === p.unitName);
        if (index > -1) {
          p['value'] = this.productOption.priceUnit[index].value;
        }
      });
    }

    if (!Utilities.isEmptyObj(this.selectedData.product['variant'])) {
      this.selectedData.product['variant'].forEach(v => {
        const index = this.productOption.variant.findIndex(x => x.name === v.name);
        if (index > -1) {
          v.value = this.productOption.variant[index].value;
        }
      });
    }

    this.selectedData.totalPrice = this.displayTotalPrice();
    this.storageCartData.push(this.selectedData);
    this.commonService.clearLocalStorageObject(LocalStorage.CartData);
    this.commonService.setLocalStorageObject(LocalStorage.CartData, this.storageCartData);
    this.router.navigate(['services/media']);
  }

  scrollToElement(elem) {
    this.scrollElem = elem;
    const element = document.querySelector('#' + elem);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  loginPopupManage() {
    const dialogRef = this.dialog.open(LoginPopupComponent, {
      width: '100%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  closeCartSideBar(data) {
    this.sidenav.close();
  }

  closeLoginDialog(data) {
    this.isLoginPopupDisplay = data;
    if (data) {
      this.loginPopupManage();
    }
  }


}
