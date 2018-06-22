import {Component, OnInit} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {Input} from "@angular/core";
import {Filters} from "../../shared/modal/filters";
import {AfterContentInit} from "@angular/core";
import {ChangeDetectorRef} from "@angular/core";
import {LocationFilter} from "../../shared/modal/filter-params";
import {ServicesService} from "../services.service";
declare var jQuery;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  searchTier:string = '';
  searchZone:string = '';
  language:string = '';
  radioStation:string = '';
  searchLocation:any;
  searchResults:string[] = [];
  locationParams:LocationFilter;

  @Input('filters') filters:Filters;
  @Input('servicePage') servicePage:string;
  @Output('geographyData') geographyData = new EventEmitter<any>();
  @Output('otherFilterData') otherFilterData = new EventEmitter<any>();

  constructor(private sr:ServicesService) {
  }

  ngOnInit() {
    jQuery('.collapsible').collapsible();
  }

  geographyDataSearch(value:any) {
    this.locationParams = new LocationFilter({q: value.query, media: this.servicePage});
    if (value.query.length > 2) {
      this.sr.getFilteredDataLocationBase(this.locationParams)
        .subscribe(data => {
          this.searchResults = data;
        });
    }
  }

  geographyDataChange() {
    const newData = [];
    this.searchLocation.forEach(x => {
      newData.push({LocationId:x.LocationId, LocationType:x.LocationType});
    });
    console.log(newData);
    this.geographyData.emit(newData);
  }

  otherFilterDataChange(event, parent, value) {
    const data = {
      checked: event.target.checked,
      parent: parent,
      value: value
    };
    this.otherFilterData.emit(data);
  }
}
