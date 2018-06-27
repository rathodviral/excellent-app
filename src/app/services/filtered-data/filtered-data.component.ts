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
      { field: 'cityName', header: 'City' }
    ];
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.selectedData);
    if (changes) {
      this.servicesService.sendCartData(this.selectedData);
    }
  }

  openLoginDialog(data) {
    this.isLoginPopupDisplay = true;
  }

  closeLoginDialog() {
    this.isLoginPopupDisplay = false;
  }

  isTokenAvailable() {
    return !Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'));
  }

  selectionData() {
    console.log('ok');

    // this.servicesService.sendCartData(['Message from Child One Component!']);
  }

  ngOnDestroy() {
    // this.dtTrigger.unsubscribe();
  }

}
