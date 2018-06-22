import {NgModule} from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {TeamComponent} from "./team/team.component";
import {AboutComponent} from "./about/about.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";
import {LoginComponent} from "./shared/components/login/login.component";

const appRoutes:Routes = [
  {path: '', redirectTo: 'services', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'team', component: TeamComponent},
  {path: 'services', loadChildren: './services/services.module#ServicesModule'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
