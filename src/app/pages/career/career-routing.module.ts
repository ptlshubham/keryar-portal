import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOpeningComponent } from './job-opening/job-opening.component';

const routes: Routes = [
  {
    path: 'job-opening',
    component: JobOpeningComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule { }
