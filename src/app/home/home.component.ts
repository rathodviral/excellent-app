import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { MatSidenav } from '@angular/material';
import { LocalStorage } from '../shared/constant/local-storage';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mediaDetail: any;
  productOptions: any[];
  scrollElem: string;
  productOption: any;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private servicesService: ServicesService) { }

  ngOnInit() {
    //air-fm-local-1001-adoni

    // const oldData = this.commonService.getLocalStorageObject(LocalStorage.CartData) || [];
    // this.storageCartData = oldData;
    // this.detailTab = 'overview';
    this.productOption = {};
    // this.isPricingOptionDisplay = false;
    this.sidenav.close();

    this.scrollElem = 'advertising-rate';
    this.productOptions = [];

    this.servicesService.getMediaDetail('radio', 'air-fm-local-1001-adoni').subscribe((response) => {

      console.log(response);
      this.mediaDetail = response;
      for (const key in this.mediaDetail.productOption) {
        if (this.mediaDetail.productOption.hasOwnProperty(key)) {
          const element = this.mediaDetail.productOption[key];
          this.productOptions.push(element);
        }
      }

    });
  }

  scrollToElement(elem) {
    this.scrollElem = elem;
    const element = document.querySelector('#' + elem);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  closeCartSideBar(data) {
    this.sidenav.close();
  }

  displayTotalPrice() {
    let total = 0;

    // total = total + this.productOption['displayPrice'];
    // this.productOption['priceUnit'].forEach(product => {
    //   total = total * product.value;
    // });


    return total;
  }

  saveDetail() {


  }

}
