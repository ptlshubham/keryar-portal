import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CategoryTabComponent } from './category-tab/category-tab.component';
import { SubToSubCategoryComponent } from './sub-to-sub-category/sub-to-sub-category.component';
import { QuetionsComponent } from './quetions/quetions.component';
import { StudentListComponent } from './student-list/student-list.component';

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



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementRoutingModule { }
