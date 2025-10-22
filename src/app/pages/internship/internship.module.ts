import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternshipRoutingModule } from './internship-routing.module';
import { InternshipResultComponent } from './internship-result/internship-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbAlertModule, NgbDropdownModule, NgbCarouselModule, NgbProgressbarModule, NgbNavModule, NgbCollapseModule, NgbAccordionModule, NgbPopoverModule, NgbTooltipModule, NgbPaginationModule, NgbToastModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountUpModule } from 'ngx-countup';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { InternshipInterviewRoundComponent } from './internship-interview-round/internship-interview-round.component';
import { ApprovedInternshipStudentsComponent } from './approved-internship-students/approved-internship-students.component';


@NgModule({
  declarations: [
    InternshipResultComponent,
    InternshipInterviewRoundComponent,
    ApprovedInternshipStudentsComponent
  ],
  imports: [
    CommonModule,
    InternshipRoutingModule,
    SharedModule,
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
export class InternshipModule { }
