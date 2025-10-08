import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CategoryTabComponent } from './category-tab/category-tab.component';
import { SubToSubCategoryComponent } from './sub-to-sub-category/sub-to-sub-category.component';
import { QuetionsComponent } from './quetions/quetions.component';
import { StudentListComponent } from './student-list/student-list.component';
import { AssessmentReviewComponent } from './assessment-review/assessment-review.component';
import { CollegeListComponent } from './college-list/college-list.component';
import { CollegeJobMappingComponent } from './college-job-mapping/college-job-mapping.component';
import { InterviewRoundComponent } from './interview-round/interview-round.component';
import { HiredStudentsComponent } from './hired-students/hired-students.component';

const routes: Routes = [
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'sub-category',
    component: SubCategoryComponent
  },
  {
    path: 'sub-to-subcategory',
    component: SubToSubCategoryComponent
  },
  {
    path: 'categorytab',
    component: CategoryTabComponent
  },
  {
    path: 'quetions',
    component: QuetionsComponent
  },
  {
    path: 'student-list',
    component: StudentListComponent
  },

  {
    path: 'assessment-review',
    component: AssessmentReviewComponent
  },

  {
    path: 'college',
    component: CollegeListComponent
  },

  {
    path: 'college-mapping',
    component: CollegeJobMappingComponent
  },
  {
    path: 'interview-round',
    component: InterviewRoundComponent
  },
  {
    path: 'hired-students',
    component: HiredStudentsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementRoutingModule { }
