import { Component, OnInit, IterableDiffers, DoCheck } from '@angular/core';
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Input } from "@angular/core";
import { FilteredData } from "../../shared/modal/filtered-data";
import { OnDestroy } from "@angular/core";
import { Subject, config } from "rxjs/index";
import { CommonService } from "../../shared/services/common.service";
import { LocalStorage } from "../../shared/constant/local-storage";
import { Utilities } from "../../shared/services/utilities";
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-filtered-data',
  templateUrl: './filtered-data.component.html',
  styleUrls: ['./filtered-data.component.css']
})
export class FilteredDataComponent implements OnInit, DoCheck, OnDestroy {

  selectedData: any[];
  isLoginPopupDisplay = false;
  userData: any = {};
  cols: any[];
  iterableDiffer: any = [];


  @Input('filteredData') filteredData: FilteredData[];
  @Input('priceOption') priceOption: string;

  @Output('loadMore') loadMore = new EventEmitter<any>();
  // @Input('selectedData') selectedData: FilteredData[];
  // @Input('dtOptions') dtOptions:DataTables.Settings;
  // @Input('dtTrigger') dtTrigger:Subject<any>;

  constructor(
    private commonService: CommonService,
    private _iterableDiffers: IterableDiffers,
    private servicesService: ServicesService) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
    if (this.isTokenAvailable()) {
      this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
    }

    this.cols = [
      { field: 'productName', header: 'Radio Station' },
      { field: 'cityName', header: 'City' },
      { field: 'frequency', header: 'Frequency' },
      { field: 'targetAudience', header: 'Audience' }
    ];
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.selectedData);
    if (changes) {
      console.log(this.selectedData);

      this.servicesService.sendCartData({ key: this.priceOption, data: this.selectedData });
    }
  }

  openLoginDialog(data) {
    this.isLoginPopupDisplay = true;
  }

  closeLoginDialog(event) {
    this.isLoginPopupDisplay = false;
  }

  isTokenAvailable() {
    return !Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'));
  }

  selectionData() {
    console.log('ok');

    // this.servicesService.sendCartData(['Message from Child One Component!']);
  }

  loadFilterData() {
    this.loadMore.emit(null);
  }

  ngOnDestroy() {
    // this.dtTrigger.unsubscribe();
  }

}
