import { WINDOW } from '@ng-toolkit/universal';
import { Injectable, Inject } from '@angular/core';
import { Utilities } from "./utilities";
import * as _ from 'lodash';

declare var humps;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(@Inject(WINDOW) private window: Window, ) { }

  convertObjectToFormData(item) {
    let formData = new FormData();
    for (var key in item) {
      formData.append(key, item[key]);
    }
    return formData
  }


  convertObjectInCamelizeKeys(data) {
    const newData = humps.camelizeKeys(data, (key, convert) => {
      return key === key.toUpperCase() ? convert(key.toLowerCase()) : convert(key);
    });
    return newData;
  }

  setLocalStorageObject(key: string, value: Object): void {
    this.window.localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageObject(key: string): any {
    let temp = this.window.localStorage.getItem(key);
    if (Utilities.isNull(temp)) {
      return null;
    }
    return JSON.parse(temp);
  }

  getDataFromLocalStorageObject(localkey: string, objkey: string): any {
    return Utilities.isNull(this.getLocalStorageObject(localkey)) ? null : this.getLocalStorageObject(localkey)[objkey];
  }

  clearLocalStorageObject(key: string) {
    this.window.localStorage.removeItem(key);
  }

  clearLocalStorageObjectAll() {
    this.window.localStorage.clear();
  }

  multiplyArrayObj(array) {
    let sum = 1;
    for (let i = 0; i < array.length; i++) {
      sum = sum * array[i].value;
    }
    return sum;
  }

  isArrayEqual(x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
  }
}
