import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { LoginComponent } from "./components/login/login.component";
import { CommonService } from "./services/common.service";
import { UserService } from "./services/user.service";
import { FilterDeepDataPipe } from 'src/app/shared/pipes/filterDeepData.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PageNotFoundComponent,
    LoginComponent,
    FilterDeepDataPipe

  ],
  exports: [
    PageNotFoundComponent,
    CommonModule,
    FormsModule,
    LoginComponent,
    ReactiveFormsModule,
    FilterDeepDataPipe

  ],
  providers: [
    CommonService,
    UserService
  ]
})
export class SharedModule {
}
