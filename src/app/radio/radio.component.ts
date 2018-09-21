import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav, MatDialog } from '@angular/material';
import { CommonService } from '../shared/services/common.service';
import { Utilities } from '../shared/services/utilities';
import { LocalStorage } from '../shared/constant/local-storage';
import { LoginPopupComponent } from '../shared/components/login-popup/login-popup.component';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit, OnDestroy {

  isCartDisplay: boolean;
  isLoginPopupDisplay: boolean;
  userData: any = {};

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private commonService: CommonService, public dialog: MatDialog) { }

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
    if (data) {
      this.loginPopupManage();
    }
  }

  closeCartSideBar(data) {
    this.isCartDisplay = data;
    this.sidenav.close();
  }

  cartDisplayCheck() {
    if (this.isTokenAvailable()) {
      this.isCartDisplay = true;
      this.sidenav.open();
      this.isLoginPopupDisplay = false;
    } else {
      this.isCartDisplay = false;
      this.sidenav.close();
      this.isLoginPopupDisplay = true;
      this.loginPopupManage();
    }
  }

  loginPopupManage() {
    const dialogRef = this.dialog.open(LoginPopupComponent, {
      width: '100%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
  }

}
