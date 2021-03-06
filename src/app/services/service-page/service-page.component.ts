import {Component, OnInit} from '@angular/core';
import {ServicesService} from "../services.service";
import {Params, Filter, LocationFilter} from "../../shared/modal/filter-params";
import {Filters, FilterData} from "../../shared/modal/filters";
import {FilteredData} from "../../shared/modal/filtered-data";
import {Utilities} from "../../shared/services/utilities";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {OnDestroy} from "@angular/core";
declare var humps;

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.css']
})
export class ServicePageComponent implements OnInit, OnDestroy {

  filters:Filters;
  filteredData:FilteredData[];
  params:Params;
  locationParams:LocationFilter;
  servicePage:string = 'radio';

  // dtOptions:DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();

  private modifyData(data) {
    const newData = humps.camelizeKeys(data, (key, convert) => {
      return key === key.toUpperCase() ? convert(key.toLowerCase()) : convert(key);
    });

    return newData;
  }

  constructor(private sr:ServicesService, private router:Router) {
    this.servicePage = this.router.url.split('/')[2];
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
    this.getFilteredData();
  }

  getFilters() {
    this.sr.getFilters(this.servicePage)
      .subscribe(data => {
        /* this.filters.language = data['LANGUAGE'];
         this.filters.radiostation = data['RADIOSTATION'];
         this.filters.tier = data['TIER'];*/
        const newfilters = this.modifyData(data);
        this.filters.language = newfilters.language;
        this.filters.radiostation = newfilters.radiostation;
        this.filters.tier = newfilters.tier;
      });
  }

  getFilteredData() {
    this.sr.getFilteredData(this.servicePage, this.params)
      .subscribe(data => {
        if (data.length > 0) {
          this.filteredData = this.modifyData(data);
        } else {
          this.filteredData = [];
        }
        this.dtTrigger.next();
      });
  }

  getGeographyFilteredData(data) {
    this.params.filters.location = data;
    this.getFilteredData();
  }

  getOtherFilteredData(data) {
    if (data.checked) {
      this.params.filters[data.parent].push(data.value);
    } else {
      this.params.filters[data.parent].splice(this.params.filters[data.parent].findIndex(x => x === data.value), 1);
    }
    this.getFilteredData()
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
