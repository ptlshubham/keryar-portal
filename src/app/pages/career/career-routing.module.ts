import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOpeningComponent } from './job-opening/job-opening.component';
import { JobApplicationListComponent } from './job-application-list/job-application-list.component';

const routes: Routes = [
  {
    path: 'job-opening',
    component: JobOpeningComponent
  },
  {
    path: 'job-application-list',
    component: JobApplicationListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule { }
