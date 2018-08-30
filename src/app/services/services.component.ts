import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { LocalStorage } from '../shared/constant/local-storage';
import { Utilities } from '../shared/services/utilities';
import { MatSidenav, MatDialog } from '@angular/material';
import { LoginPopupComponent } from '../shared/components/login-popup/login-popup.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {

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
