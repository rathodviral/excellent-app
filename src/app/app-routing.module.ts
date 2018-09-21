import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { TeamComponent } from "./team/team.component";
import { AboutComponent } from "./about/about.component";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { LoginComponent } from "./shared/components/login/login.component";
import { MediaPlanComponent } from './services/media-plan/media-plan.component';
import { MediaDetailComponent } from './services/media-detail/media-detail.component';
import { ServicePageComponent } from './services/service-page/service-page.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { RadioComponent } from './radio/radio.component';
import { RadioDetailComponent } from './radio-detail/radio-detail.component';
import { MediaDetailResolver } from './services/media-detail/media-detail.resolver';
import { ServicesComponent } from './services/services.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'radio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'team', component: TeamComponent },
  { path: 'radio', component: RadioComponent },
  { path: 'radio/:alias', component: RadioDetailComponent },
  // { path: 'radio/:alias', component: RadioDetailComponent, resolve: { detail: MediaDetailResolver } },
  // {path: 'services', loadChildren: './services/services.module#ServicesModule'},
  // {
  //   path: 'services',
  //   component: ServicesComponent,
  //   children: [
  //     { path: '', redirectTo: 'radio', pathMatch: 'full' },
  //     { path: 'radio', component: ServicePageComponent },
  //     { path: 'media', component: MediaPlanComponent },
  //     { path: 'radio/:alias', component: MediaDetailComponent },
  //     { path: 'cinema', component: ServicePageComponent },
  //     { path: 'profile', component: ProfileComponent }
  //   ]
  // },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
