import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LightboxComponent } from './lightbox/lightbox.component';
import { SweetalertComponent } from './sweetalert/sweetalert.component';
import { RatingComponent } from './rating/rating.component';
import { RangesliderComponent } from './rangeslider/rangeslider.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
     {
          path: 'lightbox',
          component: LightboxComponent
     },
     {
          path: 'sweet-alert',
          component: SweetalertComponent
     },
     {
          path: 'rating',
          component: RatingComponent
     },
     {
          path: 'rangeslider',
          component: RangesliderComponent
     },
     {
          path: 'notification',
          component: NotificationsComponent
     }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})

export class ExtendedRoutingModule { }
