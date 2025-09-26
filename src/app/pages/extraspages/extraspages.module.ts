import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTypeaheadModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { ExtraspagesRoutingModule } from './extraspages-routing.module';
import { StarterComponent } from './starter/starter.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PricingComponent } from './pricing/pricing.component';

@NgModule({
  declarations: [
    StarterComponent,
    TimelineComponent,
    FaqsComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExtraspagesRoutingModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDatepickerModule
  ]
})
export class ExtraspagesModule { }
