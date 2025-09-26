import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// Google Map
import { GoogleMapsModule } from '@angular/google-maps';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { SharedModule } from '../../shared/shared.module';
import { MapsRoutingModule } from './maps-routing.module';
import { GoogleComponent } from './google/google.component';
import { LeafletComponent } from './leaflet/leaflet.component';
import { AmchartsComponent } from './amcharts/amcharts.component';

@NgModule({
  declarations: [
    GoogleComponent,
    LeafletComponent,
    AmchartsComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    SharedModule,
    MapsRoutingModule,
    LeafletModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MapsModule { }
