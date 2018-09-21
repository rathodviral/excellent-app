import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { CommonService } from '../../shared/services/common.service';
import { LocalStorage } from '../../shared/constant/local-storage';
import { Utilities } from '../../shared/services/utilities';
import { LoginPopupComponent } from '../../shared/components/login-popup/login-popup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-media-plan',
  templateUrl: './media-plan.component.html',
  styleUrls: ['./media-plan.component.css']
})
export class MediaPlanComponent implements OnInit {

  carts: any[];
  isCartDisplay: boolean;
  isLoginPopupDisplay: boolean;
  userData: any = {};

  constructor(private commonService: CommonService, public dialog: MatDialog, private servicesService: ServicesService) { }

  ngOnInit() {
    this.carts = this.commonService.getLocalStorageObject(LocalStorage.CartData);
    this.isCartDisplay = false;
    this.isLoginPopupDisplay = false;
  }

  changeInCarts(isEdit, index) {
    if (isEdit) {

    } else {
      this.carts.splice(index, 1);
      this.commonService.clearLocalStorageObject(LocalStorage.CartData);
      this.commonService.setLocalStorageObject(LocalStorage.CartData, this.carts);
    }
  }

  saveCampaign() {
    this.servicesService.saveCart(this.carts).subscribe((response) => {
      console.log(response);
    });
  }

  isTokenAvailable() {
    this.userData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');

    return !Utilities.isEmptyObj(this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token'));
  }

  closeLoginDialog(data) {
    this.isLoginPopupDisplay = data;
    if (data) {
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

}
