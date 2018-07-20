import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalStorage } from 'src/app/shared/constant/local-storage';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-media-plan',
  templateUrl: './media-plan.component.html',
  styleUrls: ['./media-plan.component.css']
})
export class MediaPlanComponent implements OnInit {

  carts: any[];

  constructor(private commonService: CommonService, private servicesService: ServicesService) { }

  ngOnInit() {
    this.carts = this.commonService.getLocalStorageObject(LocalStorage.CartData);
  }

  changeInCarts(isEdit, index) {
    if (isEdit) {

    } else {
      this.carts.splice(index, 1);
      this.commonService.setLocalStorageObject(LocalStorage.CartData, this.carts);
    }
  }

  saveCampaign() {
    this.servicesService.saveCart(this.carts).subscribe((response) => {
      console.log(response);
    });
  }

}
