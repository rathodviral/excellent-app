import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PriceOptions } from './dynamic-price-options';
import { FormControlTypes } from '../../constant/form-control';

@Component({
  selector: 'app-dynamic-price-options',
  templateUrl: './dynamic-price-options.component.html',
  styleUrls: ['./dynamic-price-options.component.css']
})
export class DynamicPriceOptionsComponent implements OnInit {

  formControlTypes = FormControlTypes;

  @Input() priceOption: PriceOptions<any>;
  @Input() form: FormGroup;

  get isValid() { return this.form.controls[this.priceOption.key].valid; }

  constructor() { }

  ngOnInit() {
  }

}
