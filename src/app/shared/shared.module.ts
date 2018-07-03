import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { LoginComponent } from "./components/login/login.component";
import { CommonService } from "./services/common.service";
import { UserService } from "./services/user.service";
import { FilterDeepDataPipe } from 'src/app/shared/pipes/filterDeepData.pipe';
import { DynamicPriceOptionsComponent } from './components/dynamic-price-options/dynamic-price-options.component';
import { DynamicPriceOptionsService } from 'src/app/shared/components/dynamic-price-options/dynamic-price-options.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PageNotFoundComponent,
    LoginComponent,
    FilterDeepDataPipe,
    DynamicPriceOptionsComponent

  ],
  exports: [
    PageNotFoundComponent,
    CommonModule,
    FormsModule,
    LoginComponent,
    ReactiveFormsModule,
    FilterDeepDataPipe,
    DynamicPriceOptionsComponent

  ],
  providers: [
    CommonService,
    UserService,
    DynamicPriceOptionsService
  ]
})
export class SharedModule {
}
