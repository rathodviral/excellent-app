import {Component, OnInit} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Input} from "@angular/core";
import {FilteredData} from "../../shared/modal/filtered-data";
import {OnDestroy} from "@angular/core";
import {Subject} from "rxjs/index";
import {CommonService} from "../../shared/services/common.service";
import {LocalStorage} from "../../shared/constant/local-storage";
import {Utilities} from "../../shared/services/utilities";

@Component({
  selector: 'app-filtered-data',
  templateUrl: './filtered-data.component.html',
  styleUrls: ['./filtered-data.component.css']
})
export class FilteredDataComponent implements OnInit, OnDestroy{

  cols: any[];
  selectedData: any[];
  isLoginPopupDisplay:boolean = false;
  userData:any = {};


  @Input('filteredData') filteredData:FilteredData[];
  // @Input('dtOptions') dtOptions:DataTables.Settings;
  // @Input('dtTrigger') dtTrigger:Subject<any>;

  constructor(private commonService:CommonService) {}

  ngOnInit() {
    this.cols = [
      { field: 'check', header: '' },
      { field: 'radio', header: 'Radio Station' },
      { field: 'frequency', header: 'Frequency' },
      { field: 'city', header: 'City' },
      { field: 'language', header: 'Language' },
      { field: 'rank', header: 'Rank' },
      { field: 'rate', header: 'Rate Per Second' }
    ];

    if(this.isTokenAvailable()){
      this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
    }

  }

  openLoginDialog(data){
    this.isLoginPopupDisplay = true;
  }

  closeLoginDialog(){
    this.isLoginPopupDisplay = false;
  }

  isTokenAvailable(){
    return !Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'));
  }

  ngOnDestroy() {
    // this.dtTrigger.unsubscribe();
  }

}
