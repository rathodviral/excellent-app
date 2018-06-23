import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from "./services.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { ServicePageComponent } from "./service-page/service-page.component";

const servicesRoutes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    children: [
      { path: '', redirectTo: 'radio' },
      { path: 'radio', component: ServicePageComponent },
      { path: 'cinema', component: ServicePageComponent }
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
