import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {

  cartDisplay: boolean;

  constructor() { }

  ngOnInit() {
    this.cartDisplay = false;
  }

  ngOnDestroy() {
  }

}
