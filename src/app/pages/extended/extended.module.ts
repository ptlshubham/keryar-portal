import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { NgbRatingModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from 'ngx-slider-v2';
import { LightboxModule } from 'ngx-lightbox';
import { SharedModule } from '../../shared/shared.module';
import { ExtendedRoutingModule } from './extended-routing.module';
import { LightboxComponent } from './lightbox/lightbox.component';
import { SweetalertComponent } from './sweetalert/sweetalert.component';
import { RatingComponent } from './rating/rating.component';
import { RangesliderComponent } from './rangeslider/rangeslider.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ToastsContainer } from './notifications/toasts-container.component';

@NgModule({
  declarations: [
    LightboxComponent,
    SweetalertComponent,
    RatingComponent,
    RangesliderComponent,
    NotificationsComponent,
    ToastsContainer
  ],
  imports: [
    CommonModule,
    SharedModule,
    YouTubePlayerModule,
    NgbRatingModule,
    NgbToastModule,
    LightboxModule,
    ExtendedRoutingModule,
    NgxSliderModule
  ]
})
export class ExtendedModule { }
