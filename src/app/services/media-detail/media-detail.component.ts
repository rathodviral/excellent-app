import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { ServicesService } from '../services.service';
import * as _ from 'lodash';

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
  detailTab: string;
  detailUi = [{
    label: 'Overview',
    value: 'overview'
  }, {
    label: 'Radio Detail',
    value: 'detail'
  }, {
    label: 'Advertising Rate',
    value: 'rate'
  }, {
    label: 'Other Info',
    value: 'other'
  }, {
    label: 'Execution Process',
    value: 'process'
  }, {
    label: 'Pricing',
    value: 'price'
  }];
  scrollElem: string;

  constructor(private route: ActivatedRoute, private servicesService: ServicesService) {

    this.route.params.subscribe((x) => {
      this.alias = x['alias'] || null;
    });

    this.route.url.subscribe((x) => {
      this.page = x[0]['path'] || null;
    });

  }

  ngOnInit() {
    this.detailTab = 'overview';
    this.scrollElem = 'advertising-rate';
    this.productOptions = [];
    this.productOption = {};
    this.servicesService.getMediaDetail(this.page, this.alias).subscribe((response) => {
      this.mediaDetail = _.cloneDeep(response);
      this.mediaDetail['metaData'] = JSON.parse(response['metaData']);
      this.mediaDetail['specification'].forEach(element => {
        element['additionalInfo'] = JSON.parse(element['additionalInfo']);
      });
      console.log(this.mediaDetail);
      for (const key in this.mediaDetail.productOption) {
        if (this.mediaDetail.productOption.hasOwnProperty(key)) {
          const element = this.mediaDetail.productOption[key];
          this.productOptions.push(element);
        }
      }
      console.log(_.values(_.groupBy(this.productOptions, 'optionSection')));
      // console.log(_.map(_.keyBy(this.productOption, 'optionSection')));
    });

    jQuery('.view-pricing').sideNav({
      edge: 'right',
      closeOnClick: true
    });
  }

  scrollToElement(elem) {
    this.scrollElem = elem;
    const element = document.querySelector('#' + elem);
    element.scrollIntoView({ behavior: 'smooth' });
  }

}
