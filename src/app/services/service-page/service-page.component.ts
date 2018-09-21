import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServicesService } from "../services.service";
import { Params, Filter, LocationFilter } from "../../shared/modal/filter-params";
import { Filters, FilterData } from "../../shared/modal/filters";
import { FilteredData } from "../../shared/modal/filtered-data";
import { Utilities } from "../../shared/services/utilities";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { OnDestroy } from "@angular/core";
import { MatTableDataSource, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../../shared/services/common.service';
import { LocalStorage } from '../../shared/constant/local-storage';
declare var humps;

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.css']
})
export class ServicePageComponent implements OnInit, OnDestroy {

  filters: Filters;
  filteredData: FilteredData[] = [];
  filterDataNew: any;
  params: Params;
  locationParams: LocationFilter;
  priceOption: string;
  // selectedData: FilterData[] = [];

  // dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  // Filter component

  searchTier = '';
  searchZone = '';
  language = '';
  radioStation = '';
  optionType = '';
  searchLocation: any[] = [];
  myControl = new FormControl();
  searchResults: string[] = [];

  // Filterdata component

  selectedData: any[];
  isLoginPopupDisplay = false;
  userData: any = {};
  cols: any[];
  iterableDiffer: any = [];

  displayedColumns: string[] = ['select', 'productName', 'cityName', 'frequency', 'targetAudience', 'price'];
  dataSource: any;
  selection = new SelectionModel<FilteredData>(true, []);

  @Input() page: string;

  @ViewChild(MatSort) sort: MatSort;

  private modifyData(data) {
    const newData = humps.camelizeKeys(data, (key, convert) => {
      return key === key.toUpperCase() ? convert(key.toLowerCase()) : convert(key);
    });

    return newData;
  }

  constructor(
    private sr: ServicesService,
    private router: Router,
    private commonService: CommonService) {
    this.page = this.router.url.split('/')[2];
    this.myControl.valueChanges.subscribe(newValue => {
      if (Utilities.isEmptyObj(newValue.LocationId)) {
        this.geographyDataSearch(newValue);
      } else {
        this.searchLocation.push(newValue);
        this.geographyDataChange();
        this.myControl.setValue('');
      }
    });

    if (this.isTokenAvailable()) {
      this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
      this.sr.sendCartData({ key: [], data: [] });
    }
  }

  ngOnInit() {
    this.filters = new Filters();
    this.params = new Params();
    // this.filteredData = new FilteredData();

    // this.dtOptions = {
    //   paging: false,
    //   searching: false,
    //   scrollX: false,
    //   info: false,
    //   autoWidth: true,
    //   responsive: true,
    //   columnDefs: [
    //     {orderable: false, targets: 0},
    //     {orderable: false, targets: 6}
    //   ]
    // };

    this.getFilters();
  }

  getFilters() {
    this.sr.getFilters(this.page)
      .subscribe(data => {
        /* this.filters.language = data['LANGUAGE'];
         this.filters.radiostation = data['RADIOSTATION'];
         this.filters.tier = data['TIER'];*/
        // const newfilters = this.modifyData(data);
        // this.filters.language = newfilters.language;
        // this.filters.radiostation = newfilters.radiostation;
        // this.filters.tier = newfilters.tier;

        this.priceOption = data.optionType[0].optionCode;
        this.params.optionType = data.optionType[0].optionCode;
        this.filters = data;
        this.getFilteredData(false);

      });
  }

  getFilteredData(isConcat) {
    this.sr.getFilteredData(this.page, this.params)
      .subscribe(data => {
        if (data.length > 0) {
          // this.filteredData = this.modifyData(data);
          if (isConcat) {
            this.filteredData = this.filteredData.concat(data);
          } else {
            this.filteredData = data;
          }
        } else {
          this.filteredData = [];
        }

        this.filterDataNew = this.filteredData;
        this.dataSource = new MatTableDataSource<FilteredData>(this.filterDataNew);
        this.dataSource.sort = this.sort;
      });
  }

  getGeographyFilteredData(data) {
    this.params.filters.location = data;
    this.params.offset = 0;
    this.getFilteredData(false);
  }

  getOtherFilteredData(data) {
    if (data.checked) {
      if (data.type === 'filter') {
        this.params.filters[data.parent].push(data.value);
      } else if (data.type === 'param') {
        // this.params[data.parent].push(data.value);
        this.params[data.parent] = data.value;
        this.priceOption = data.value;

      }
    } else {
      if (data.type === 'filter') {
        this.params.filters[data.parent].splice(this.params.filters[data.parent].findIndex(x => x === data.value), 1);
      } else if (data.type === 'param') {
        // this.params[data.parent].splice(this.params[data.parent].findIndex(x => x === data.value), 1);
        this.params[data.parent] = data.value;
        this.priceOption = data.value;

      }
    }
    this.params.offset = 0;
    this.getFilteredData(false);
  }

  loadMoreData(data) {
    this.params.offset = this.params.offset + this.params.limit;
    this.getFilteredData(true);
  }

  displayFn(data?: any): string | undefined {
    return data ? data.LocationName : undefined;
  }

  geographyDataSearch(value: any) {
    // this.locationParams = new LocationFilter({ q: value.query, media: this.servicePage });
    this.locationParams = new LocationFilter({ q: value, media: this.page });
    // if (value.query.length > 2) {
    this.searchResults = [];

    if (value.length > 2) {
      this.sr.getFilteredDataLocationBase(this.locationParams)
        .subscribe(data => {
          this.searchResults = data;

        });
    }
  }

  geographyDataChange() {
    const newData = [];
    this.searchLocation.forEach(x => {
      newData.push({ LocationId: x.LocationId, LocationType: x.LocationType });
    });
    // this.geographyData.emit(newData);
    this.getGeographyFilteredData(newData);
  }

  removeSearchLocation(index) {
    this.searchLocation.splice(index, 1);
    this.geographyDataChange();
  }

  otherFilterDataChange(event, parent, value, type) {
    const data = {
      checked: event.target.checked,
      parent: parent,
      value: value,
      type: type
    };
    // this.otherFilterData.emit(data);
    this.getOtherFilteredData(data);
  }

  loadFilterData() {
    this.loadMoreData(null);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.sr.sendCartData({ key: [], data: this.selection.selected });

  }

  checkBoxSelection(row) {
    this.selection.toggle(row);
    this.sr.sendCartData({ key: [], data: this.selection.selected });
  }

  isTokenAvailable() {
    return !Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'));
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
