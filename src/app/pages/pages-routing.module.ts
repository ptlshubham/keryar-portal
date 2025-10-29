import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CallToActionListComponent } from './call-to-action-list/call-to-action-list.component';
import { StudentListComponent } from './placement/student-list/student-list.component';
import { StudentformListComponent } from './studentform-list/studentform-list.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'workfolio', loadChildren: () => import('./workfolio/workfolio.module').then(m => m.WorkfolioModule)
  },
  {
    path: 'placement', loadChildren: () => import('./placement/placement.module').then(m => m.PlacementModule)
  },
  {
    path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
  },
  {
    path: 'career', loadChildren: () => import('./career/career.module').then(m => m.CareerModule)
  },
  {
    path: 'connect', loadChildren: () => import('./connect/connect.module').then(m => m.ConnectModule)
  },
  {
    path: 'internship', loadChildren: () => import('./internship/internship.module').then(m => m.InternshipModule)
  },
  {
    path: 'call-to-action',
    component: CallToActionListComponent
  },
  {
    path: 'student-form-list',
    component: StudentformListComponent
  },
  // {
  //   path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule)
  // },
  // {
  //   path: 'ui', loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
  // },
  // {
  //   path: 'extended', loadChildren: () => import('./extended/extended.module').then(m => m.ExtendedModule)
  // },
  // {
  //   path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  // },
  // {
  //   path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
  // },
  // {
  //   path: 'chart', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule)
  // },
  // {
  //   path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
  // },
  // {
  //   path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
