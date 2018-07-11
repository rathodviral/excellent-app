import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Utilities } from "../../shared/services/utilities";
import { LocalStorage } from "../../shared/constant/local-storage";
import { CommonService } from "../../shared/services/common.service";
declare var jQuery;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData: any = {};

  @Output() loginDisplay = new EventEmitter<boolean>();

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    jQuery('.button-collapse').sideNav();
    jQuery('.search-overly').sideNav({
      edge: 'left',
      closeOnClick: true
    });
    jQuery('.dropdown-account-large').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'right', // Displays dropdown with edge aligned to the left of button
      stopPropagation: true // Stops event propagation
    });

    if (this.isTokenAvailable()) {
    }
  }

  isTokenAvailable() {
    if (!Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'))) {
      this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
      return true;
    } else {
      return false;
    }
  }

  userLoginClick() {
    this.loginDisplay.emit(true);
  }
  userLogoutClick() {
    this.commonService.clearLocalStorageObject(LocalStorage.UserData);
    this.userData = {};
  }
}
