import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {LoginComponent} from "./components/login/login.component";
import {CommonService} from "./services/common.service";
import {UserService} from "./services/user.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PageNotFoundComponent,
    LoginComponent
  ],
  exports: [
    PageNotFoundComponent,
    CommonModule,
    FormsModule,
    LoginComponent,
    ReactiveFormsModule
  ],
  providers:[
    CommonService,
    UserService
  ]
})
export class SharedModule {
}
