import { Injectable } from '@angular/core';
import { Utilities } from "./utilities";

declare var humps;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

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
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageObject(key: string): any {
    let temp = window.localStorage.getItem(key);
    if (Utilities.isNull(temp)) {
      return null;
    }
    return JSON.parse(temp);
  }

  getDataFromLocalStorageObject(localkey: string, objkey: string): any {
    return Utilities.isNull(this.getLocalStorageObject(localkey)) ? null : this.getLocalStorageObject(localkey)[objkey];
  }

  clearLocalStorageObject(key: string) {
    window.localStorage.removeItem(key);
  }

  clearLocalStorageObjectAll() {
    window.localStorage.clear();
  }

  multiplyArrayObj(array) {
    let sum = 1;
    for (let i = 0; i < array.length; i++) {
      sum = sum * array[i].value;
    }
    return sum;
  }
}
