import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatTableModule, MatExpansionModule, MatSortModule, MatAutocompleteModule, MatInputModule, MatSidenavModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { LoginComponent } from "./components/login/login.component";
import { CommonService } from "./services/common.service";
import { UserService } from "./services/user.service";
import { DynamicPriceOptionsComponent } from './components/dynamic-price-options/dynamic-price-options.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FilterDeepDataPipe } from './pipes/filterDeepData.pipe';
import { DynamicPriceOptionsService } from './components/dynamic-price-options/dynamic-price-options.service';
import { LoginPopupComponent } from './components/login-popup/login-popup.component';
import { FilterPipe } from './pipes/filter.pipe';
import { MediaPipe } from './pipes/media.pipe';
import { HeaderComponent } from './components/header/header.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { CartComponent } from './components/cart/cart.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDialogModule
  ],
  declarations: [
    PageNotFoundComponent,
    LoginComponent,
    FilterDeepDataPipe,
    DynamicPriceOptionsComponent,
    ProfileComponent,
    LoginPopupComponent,
    FilterPipe,
    MediaPipe,
    HeaderComponent,
    SubHeaderComponent,
    CartComponent,
    FooterComponent
  ],
  exports: [
    PageNotFoundComponent,
    CommonModule,
    FormsModule,
    LoginComponent,
    ReactiveFormsModule,
    FilterDeepDataPipe,
    DynamicPriceOptionsComponent,
    ProfileComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDialogModule,
    LoginPopupComponent,
    FilterPipe,
    MediaPipe,
    HeaderComponent,
    SubHeaderComponent,
    CartComponent,
    FooterComponent
  ],
  providers: [
    CommonService,
    UserService,
    DynamicPriceOptionsService
  ]
})
export class SharedModule {
}
