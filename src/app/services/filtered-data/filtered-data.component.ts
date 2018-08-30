import { Component, OnInit, IterableDiffers, DoCheck, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Input } from "@angular/core";
import { FilteredData } from "../../shared/modal/filtered-data";
import { OnDestroy } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { LocalStorage } from "../../shared/constant/local-storage";
import { Utilities } from "../../shared/services/utilities";
import { ServicesService } from '../services.service';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { LoginPopupComponent } from 'src/app/shared/components/login-popup/login-popup.component';

@Component({
  selector: 'app-filtered-data',
  templateUrl: './filtered-data.component.html',
  styleUrls: ['./filtered-data.component.css']
})
export class FilteredDataComponent implements OnInit, OnChanges, DoCheck, OnDestroy {

  selectedData: any[];
  isLoginPopupDisplay = false;
  userData: any = {};
  cols: any[];
  iterableDiffer: any = [];

  displayedColumns: string[] = ['select', 'productName', 'cityName', 'frequency', 'targetAudience', 'price'];
  dataSource: any;
  selection = new SelectionModel<FilteredData>(true, []);

  @Input('filteredData') filteredData: FilteredData[];
  @Input() filterDataNew: Observable<FilteredData[]>;
  @Input('priceOption') priceOption: any[];

  @Output('loadMore') loadMore = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private commonService: CommonService,
    private _iterableDiffers: IterableDiffers,
    private servicesService: ServicesService, public dialog: MatDialog) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
    if (this.isTokenAvailable()) {
      this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
      this.servicesService.sendCartData({ key: [], data: [] });
    }

    // this.cols = [
    //   { field: 'cityName', header: 'City' },
    //   { field: 'frequency', header: 'Frequency' },
    //   { field: 'targetAudience', header: 'Audience' }
    // ];

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filterDataNew && !changes.filterDataNew.firstChange) {
      this.dataSource = new MatTableDataSource<FilteredData>(changes.filterDataNew.currentValue);
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    }
    // if (changes['filterDataNew'] && this.filterDataNew) {
    //   this.filterDataNew.subscribe((value) => {
    //     this.dataSource = new MatTableDataSource<FilteredData>(value);

    //   });

    // }
  }

  ngDoCheck() {
    // let changes = this.iterableDiffer.diff(this.selectedData);

    // if (changes) {
    //   this.servicesService.sendCartData({ key: [], data: this.selectedData });
    // }
  }

  openLoginDialog(data) {
    this.isLoginPopupDisplay = true;
    const dialogRef = this.dialog.open(LoginPopupComponent, {
      width: '100%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  closeLoginDialog(event) {
    this.isLoginPopupDisplay = false;
  }

  isTokenAvailable() {
    return !Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'));
  }

  selectionData() {
    // this.servicesService.sendCartData(['Message from Child One Component!']);
  }

  loadFilterData() {
    this.loadMore.emit(null);
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
    this.servicesService.sendCartData({ key: [], data: this.selection.selected });

  }

  checkBoxSelection(row) {
    this.selection.toggle(row);
    this.servicesService.sendCartData({ key: [], data: this.selection.selected });
  }

  ngOnDestroy() {
    // this.dtTrigger.unsubscribe();
  }

}
