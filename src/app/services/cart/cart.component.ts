import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  addToCartData: any[] = [];
  filterObj = {
    campaignName: ''
  };
  isSelectIndividualTab = false;

  constructor(private servicesService: ServicesService) { }

  ngOnInit() {
    this.subscription = this.servicesService.getCartData().subscribe(x => {
      if (!Utilities.isEmptyObj(x)) {
        this.addToCartData = x;
        console.log(this.addToCartData);

      }
    });
  }

  saveCartData() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
