import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatSidenav, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { CommonService } from '../shared/services/common.service';
import { Utilities } from '../shared/services/utilities';
import { LocalStorage } from '../shared/constant/local-storage';
import { LoginPopupComponent } from '../shared/components/login-popup/login-popup.component';
import { Filters } from '../shared/modal/filters';
import { FilteredData } from '../shared/modal/filtered-data';
import { Router } from '@angular/router';
import { LocationFilter, Params } from '../shared/modal/filter-params';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from '../app.service';

@Component({
  selector: 'app-outdoor',
  templateUrl: './outdoor.component.html',
  styleUrls: ['./outdoor.component.css']
})
export class OutdoorComponent implements OnInit, OnDestroy {

  isCartDisplay: boolean;
  isLoginPopupDisplay: boolean;
  userData: any = {};

  // Service page Component
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
  mediaName = '';
  illumination = '';
  optionType = '';
  searchLocation: any[] = [];
  myControl = new FormControl();
  searchResults: string[] = [];

  // Filterdata component

  selectedData: any[];
  cols: any[];
  iterableDiffer: any = [];

  displayedColumns: string[] = ['select', 'productName', 'cityName', 'media', 'localityName', 'price'];
  dataSource: any;
  selection = new SelectionModel<FilteredData>(true, []);

  page = 'outdoor';

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    private sr: AppService,
    private router: Router) {
    // this.page = this.router.url.split('/')[2];
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
    this.isCartDisplay = false;
    this.isLoginPopupDisplay = false;
    this.filters = new Filters();
    this.params = new Params();

    this.getFilters();
  }

  isTokenAvailable() {
    if (!Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'))) {
      this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
      return true;
    } else {
      return false;
    }
  }

  closeLoginDialog(data) {
    this.isLoginPopupDisplay = data;
    if (data) {
      this.loginPopupManage();
    }
  }

  closeCartSideBar(data) {
    this.isCartDisplay = data;
    this.sidenav.close();
  }

  cartDisplayCheck() {
    if (this.isTokenAvailable()) {
      this.isCartDisplay = true;
      this.sidenav.open();
      this.isLoginPopupDisplay = false;
    } else {
      this.isCartDisplay = false;
      this.sidenav.close();
      this.isLoginPopupDisplay = true;
      this.loginPopupManage();
    }
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

  getFilters() {
    this.sr.getFilters(this.page)
      .subscribe(data => {
        this.priceOption = data.optionType[0].optionCode;
        this.params.optionType = data.optionType[0].optionCode;
        this.params.filters.medianame.push(data.medianame[0].filterValueId);
        this.params.filters.illumination.push(data.illumination[0].filterValueId);
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
    console.log(data.parent);

    if (data.checked) {
      if (data.type === 'filter') {
        this.params.filters[data.parent].push(data.value);
      } else if (data.type === 'param' && data.parent === 'screenPreference') {
        // this.params[data.parent].splice(this.params[data.parent].findIndex(x => x === data.value), 1);
        this.params.filters[data.parent] = data.value;
        this.priceOption = data.value;

      } else if (data.type === 'param' && data.parent !== 'screenPreference') {
        // this.params[data.parent].splice(this.params[data.parent].findIndex(x => x === data.value), 1);
        this.params[data.parent] = data.value;
        this.priceOption = data.value;

      }
    } else {
      if (data.type === 'filter') {
        this.params.filters[data.parent].splice(this.params.filters[data.parent].findIndex(x => x === data.value), 1);
      } else if (data.type === 'param' && data.parent === 'screenPreference') {
        // this.params[data.parent].splice(this.params[data.parent].findIndex(x => x === data.value), 1);
        this.params.filters[data.parent] = data.value;
        this.priceOption = data.value;

      } else if (data.type === 'param' && data.parent !== 'screenPreference') {
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

  ngOnDestroy() {
  }

}
