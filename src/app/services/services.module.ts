import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoutingModule } from "./services-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ServicesComponent } from "./services.component";
import { HeaderComponent } from './header/header.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { CartComponent } from './cart/cart.component';
import { FooterComponent } from './footer/footer.component';
import { FiltersComponent } from "./filters/filters.component";
import { FilteredDataComponent } from "./filtered-data/filtered-data.component";
import { HttpClientModule } from "@angular/common/http";
import { ServicesService } from "./services.service";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { FilterPipe } from './filter.pipe';
import { ServicePageComponent } from './service-page/service-page.component';
import { DataTablesModule } from "angular-datatables/index";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { MediaPlanComponent } from './media-plan/media-plan.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    ServiceRoutingModule,
    DataTablesModule,
    AutoCompleteModule,
    TableModule,
    DialogModule,
    DropdownModule,
    SidebarModule,
    AccordionModule
  ],
  declarations: [
    ServicesComponent,
    HeaderComponent,
    SubHeaderComponent,
    CartComponent,
    FooterComponent,
    FiltersComponent,
    FilteredDataComponent,
    FilterPipe,
    ServicePageComponent,
    MediaPlanComponent
  ],
  providers: [
    ServicesService
  ]
})
export class ServicesModule {
}
