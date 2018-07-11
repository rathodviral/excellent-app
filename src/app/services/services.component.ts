import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalStorage } from 'src/app/shared/constant/local-storage';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {

  isCartDisplay: boolean;
  isLoginPopupDisplay: boolean;
  userData: any = {};

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.isCartDisplay = false;
    this.isLoginPopupDisplay = false;
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
  }

  cartDisplayCheck() {
    if (this.isTokenAvailable()) {
      this.isCartDisplay = true;
      this.isLoginPopupDisplay = false;
    } else {
      this.isCartDisplay = false;
      this.isLoginPopupDisplay = true;
    }
  }

  ngOnDestroy() {
  }

}
