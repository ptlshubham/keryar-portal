import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbAlertModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from 'src/app/core/core.module';
import { CountUpModule } from 'ngx-countup';
import { LightboxModule } from 'ngx-lightbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { WorkfolioRoutingModule } from './workfolio-routing.module';
import { ClientsComponent } from './clients/clients.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';



@NgModule({
  declarations: [
    ClientsComponent,
    TestimonialsComponent,
    PortfolioComponent,
    CaseStudiesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WorkfolioRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgbAlertModule,
    DropzoneModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbToastModule,
    NgSelectModule,
    NgbTypeaheadModule,
    CountUpModule,
    LightboxModule,

  ]
})
export class WorkfolioModule { }
