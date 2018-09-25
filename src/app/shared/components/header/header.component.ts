import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Utilities } from '../../services/utilities';
import { LocalStorage } from '../../constant/local-storage';
declare var jQuery;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData: any = {};

  @Output() loginDisplay = new EventEmitter<boolean>();

  constructor(
    private commonService: CommonService,
    private userService: UserService) { }

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
    this.userService.sendUserInfoData(true);
  }
  userLogoutClick() {
    this.commonService.clearLocalStorageObject(LocalStorage.UserData);
    this.userData = {};
    this.userService.sendUserInfoData(false);
  }
}
