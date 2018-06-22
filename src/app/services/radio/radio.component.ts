import {Component, OnInit} from '@angular/core';
import {ServicesService} from "../services.service";
import {Params, Filter, LocationFilter} from "../../shared/modal/filter-params";
import {Filters, FilterData} from "../../shared/modal/filters";
import {FilteredData} from "../../shared/modal/filtered-data";
import {Utilities} from "../../shared/services/utilities";
import {Router} from "@angular/router";
declare var humps;

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {

  filters:Filters;
  filteredData:FilteredData[];
  params:Params;
  locationParams:LocationFilter;
  servicePage:string = 'radio';

  private modifyData(data){
    const newData = humps.camelizeKeys(data, (key, convert) => {
      return key === key.toUpperCase() ? convert(key.toLowerCase()) : convert(key);
    });

    /*newData.forEach((v)=> {
      let l = v.language.split(',');
      let s = v.radiostation.split(',');
      v.language = [];
      v.radiostation = [];
      l.forEach((lv) => {
        v.language.push(Utilities.isUndefined(this.filters.language.find(x => x.FilterValueId === lv)) ? '' : this.filters.language.find(x => x.FilterValueId === lv).FilterValueName);
      });
      s.forEach((sv) => {
        v.radiostation.push(Utilities.isUndefined(this.filters.radioStation.find(x => x.FilterValueId === sv)) ? '' : this.filters.radioStation.find(x => x.FilterValueId === sv).FilterValueName);
      });
      v.language = v.language.join(',');
      v.radiostation = v.radiostation.join(',');
    });*/

    return newData;
  }

  constructor(
    private sr:ServicesService,
    private router:Router
  ) {
    this.servicePage = this.router.url.split('/')[2];
  }

  ngOnInit() {
    this.filters = new Filters();
    this.params = new Params();
    // this.filteredData = new FilteredData();
    /*this.getFilters();
    this.getFilteredData();*/
  }

  getFilters() {
    this.sr.getFilters(this.servicePage)
      .subscribe(data => {
        /*this.filters.language = data['LANGUAGE'];
        this.filters.radiostation = data['RADIOSTATION'];
        this.filters.tier = data['TIER'];*/
      });
  }

  getFilteredData() {
    this.sr.getFilteredData(this.servicePage, this.params)
      .subscribe(data => {
        if (data.length > 0) {
          this.filteredData = this.modifyData(data);
          console.log(this.filteredData);
        }else{
          this.filteredData = [];
        }

      });
  }

  getGeographyFilteredData(q) {
    this.locationParams = new LocationFilter({
      q: q,
      media: this.servicePage
    });
    this.sr.getFilteredDataLocationBase(this.locationParams)
      .subscribe(data => {
        if (data.length > 0) {
          this.params.filters.location = data;
        }else{
          this.params.filters.location = [];
        }
        this.getFilteredData();
      });
  }

  getOtherFilteredData(data) {
    if(data.checked){
      this.params.filters[data.parent].push(data.value);
    }else{
      this.params.filters[data.parent].splice(this.params.filters[data.parent].findIndex(x => x === data.value), 1);
    }
    this.getFilteredData()
  }

}
