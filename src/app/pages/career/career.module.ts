import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbAlertModule, NgbDropdownModule, NgbCarouselModule, NgbProgressbarModule, NgbNavModule, NgbCollapseModule, NgbAccordionModule, NgbPopoverModule, NgbTooltipModule, NgbPaginationModule, NgbToastModule, NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountUpModule } from 'ngx-countup';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CareerRoutingModule } from './career-routing.module';
import { JobOpeningComponent } from './job-opening/job-opening.component';
import { JobApplicationListComponent } from './job-application-list/job-application-list.component';
import { CareerResultComponent } from './career-result/career-result.component';
import { ApprovedCareerPersonComponent } from './approved-career-person/approved-career-person.component';
import { CareerInterviewRoundComponent } from './career-interview-round/career-interview-round.component';


@NgModule({
  declarations: [
    JobOpeningComponent,
    JobApplicationListComponent,
    CareerResultComponent,
    ApprovedCareerPersonComponent,
    CareerInterviewRoundComponent
  ],
  imports: [
    CommonModule,
    CareerRoutingModule,
    SharedModule,
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
    NgbModule
  ]
})
export class CareerModule { }
