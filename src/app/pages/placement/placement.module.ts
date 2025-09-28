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


@NgModule({
  declarations: [
    CategoryComponent,
    SubCategoryComponent,
    CategoryTabComponent
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
