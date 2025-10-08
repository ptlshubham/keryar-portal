import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementRoutingModule } from './placement-routing.module';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbAlertModule, NgbDropdownModule, NgbCarouselModule, NgbProgressbarModule, NgbNavModule, NgbCollapseModule, NgbAccordionModule, NgbPopoverModule, NgbTooltipModule, NgbPaginationModule, NgbToastModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountUpModule } from 'ngx-countup';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkfolioRoutingModule } from '../workfolio/workfolio-routing.module';
import { CategoryTabComponent } from './category-tab/category-tab.component';
import { SubToSubCategoryComponent } from './sub-to-sub-category/sub-to-sub-category.component';
import { QuetionsComponent } from './quetions/quetions.component';
import { StudentListComponent } from './student-list/student-list.component';
import { AssessmentReviewComponent } from './assessment-review/assessment-review.component';
import { CollegeListComponent } from './college-list/college-list.component';
import { CollegeJobMappingComponent } from './college-job-mapping/college-job-mapping.component';
import { InterviewRoundComponent } from './interview-round/interview-round.component';


@NgModule({
  declarations: [
    CategoryComponent,
    SubCategoryComponent,
    CategoryTabComponent,
    SubToSubCategoryComponent,
    QuetionsComponent,
    StudentListComponent,
    AssessmentReviewComponent,
    CollegeListComponent,
    CollegeJobMappingComponent,
    InterviewRoundComponent,
  ],
  imports: [
    CommonModule,
    PlacementRoutingModule,
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
export class PlacementModule { }
