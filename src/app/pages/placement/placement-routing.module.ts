import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CategoryTabComponent } from './category-tab/category-tab.component';
import { SubToSubCategoryComponent } from './sub-to-sub-category/sub-to-sub-category.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementRoutingModule { }
