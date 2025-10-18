import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// counter
import { CountUpModule } from 'ngx-countup';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
// import { LightboxModule } from 'ngx-lightbox';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { SharedModule } from '../shared/shared.module';
import { WidgetModule } from '../shared/widget/widget.module';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CallToActionListComponent } from './call-to-action-list/call-to-action-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CallToActionListComponent,
  ],
  imports: [
    CommonModule,
    WidgetModule,
    CountUpModule,
    SharedModule,
    NgApexchartsModule,
    PagesRoutingModule,
    SimplebarAngularModule,
    CarouselModule,
    FeatherModule.pick(allIcons),
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    // LightboxModule,
    LeafletModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
