import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Utilities } from "./utilities";
import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';

declare var humps;
declare var $;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getLocalStorageObject(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      let temp = localStorage.getItem(key);
      if (Utilities.isNull(temp)) {
        return null;
      }
      return JSON.parse(temp);
    }

  }

  getDataFromLocalStorageObject(localkey: string, objkey: string): any {
    return Utilities.isNull(this.getLocalStorageObject(localkey)) ? null : this.getLocalStorageObject(localkey)[objkey];
  }

  clearLocalStorageObject(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clearLocalStorageObjectAll() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
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

  printToaster(type, message) {
    if (type === 'error') {
      $.growl.error({ message: message });
    } else if (type === 'notice') {
      $.growl.notice({ message: message });
    } else if (type === 'warning') {
      $.growl.warning({ message: message });
    } else {
      $.growl({ title: type, message: message });

    }
  }
}
