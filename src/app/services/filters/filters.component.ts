import { Component, OnInit } from '@angular/core';
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Input } from "@angular/core";
import { Filters } from "../../shared/modal/filters";
import { AfterContentInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { LocationFilter } from "../../shared/modal/filter-params";
import { ServicesService } from "../services.service";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Utilities } from '../../shared/services/utilities';
declare var jQuery;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  searchTier: string = '';
  searchZone: string = '';
  language: string = '';
  radioStation: string = '';
  optionType: string = '';
  searchLocation: any[] = [];
  myControl = new FormControl();
  searchResults: string[] = [];
  locationParams: LocationFilter;

  @Input('filters') filters: Filters;
  @Input('servicePage') servicePage: string;
  @Output('geographyData') geographyData = new EventEmitter<any>();
  @Output('otherFilterData') otherFilterData = new EventEmitter<any>();

  constructor(private sr: ServicesService) {
  }

  ngOnInit() {
    jQuery('.collapsible').collapsible();
    this.myControl.valueChanges.subscribe(newValue => {
      if (Utilities.isEmptyObj(newValue.LocationId)) {
        this.geographyDataSearch(newValue);
      } else {
        this.searchLocation.push(newValue);
        this.geographyDataChange();
        this.myControl.setValue('');
      }
    });
  }

  displayFn(data?: any): string | undefined {
    return data ? data.LocationName : undefined;
  }

  geographyDataSearch(value: any) {
    // this.locationParams = new LocationFilter({ q: value.query, media: this.servicePage });
    this.locationParams = new LocationFilter({ q: value, media: this.servicePage });
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
    this.geographyData.emit(newData);
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
    this.otherFilterData.emit(data);
  }
}
