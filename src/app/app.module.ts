import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./home/home.component";
import { TeamComponent } from "./team/team.component";
import { AboutComponent } from "./about/about.component";
import { SharedModule } from "./shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { isPlatformBrowser } from '@angular/common';
import { ServicesService } from './services/services.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './services/header/header.component';
import { SubHeaderComponent } from './services/sub-header/sub-header.component';
import { CartComponent } from './services/cart/cart.component';
import { FooterComponent } from './services/footer/footer.component';
import { FiltersComponent } from './services/filters/filters.component';
import { FilteredDataComponent } from './services/filtered-data/filtered-data.component';
import { FilterPipe } from './services/filter.pipe';
import { MediaPipe } from './services/media.pipe';
import { ServicePageComponent } from './services/service-page/service-page.component';
import { MediaPlanComponent } from './services/media-plan/media-plan.component';
import { MediaDetailComponent } from './services/media-detail/media-detail.component';
import { LoginPopupComponent } from './shared/components/login-popup/login-popup.component';
import { RadioComponent } from './radio/radio.component';
import { RadioDetailComponent } from './radio-detail/radio-detail.component';
import { MediaDetailResolver } from './services/media-detail/media-detail.resolver';
import { ServicesComponent } from './services/services.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TeamComponent,
    AboutComponent,
    HeaderComponent,
    SubHeaderComponent,
    CartComponent,
    FooterComponent,
    FiltersComponent,
    FilteredDataComponent,
    FilterPipe,
    MediaPipe,
    ServicePageComponent,
    MediaPlanComponent,
    MediaDetailComponent,
    RadioComponent,
    RadioDetailComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'excellent-app' }),
    FormsModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ServicesService, MediaDetailResolver],
  bootstrap: [AppComponent],
  entryComponents: [LoginPopupComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
