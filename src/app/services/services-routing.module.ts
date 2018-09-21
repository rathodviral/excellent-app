/* import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from "./services.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { ServicePageComponent } from "./service-page/service-page.component";
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { MediaPlanComponent } from './media-plan/media-plan.component';

const servicesRoutes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    children: [
      { path: '', redirectTo: 'radio' },
      { path: 'radio', component: ServicePageComponent },
      { path: 'media', component: MediaPlanComponent },
      { path: 'radio/detail/:alias', component: MediaDetailComponent },
      { path: 'cinema', component: ServicePageComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(servicesRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class ServiceRoutingModule {
}
 */