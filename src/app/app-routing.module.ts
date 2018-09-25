import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamComponent } from './team/team.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { LoginComponent } from './shared/components/login/login.component';
import { RadioComponent } from './radio/radio.component';
import { RadioDetailComponent } from './radio-detail/radio-detail.component';
import { MediaPlanComponent } from './media-plan/media-plan.component';
import { ProfileComponent } from './shared/components/profile/profile.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'radio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'team', component: TeamComponent },
  { path: 'radio', component: RadioComponent },
  { path: 'radio/:alias', component: RadioDetailComponent },
  { path: 'media', component: MediaPlanComponent },
  { path: 'profile', component: ProfileComponent },
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
