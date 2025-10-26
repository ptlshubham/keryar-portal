import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOpeningComponent } from './job-opening/job-opening.component';
import { JobApplicationListComponent } from './job-application-list/job-application-list.component';
import { CareerResultComponent } from './career-result/career-result.component';
import { CareerInterviewRoundComponent } from './career-interview-round/career-interview-round.component';
import { ApprovedCareerPersonComponent } from './approved-career-person/approved-career-person.component';

const routes: Routes = [
  {
    path: 'job-opening',
    component: JobOpeningComponent
  },
  {
    path: 'job-application-list',
    component: JobApplicationListComponent
  },
  {
    path: 'career-result',
    component: CareerResultComponent
  },
  {
    path: 'interview-round',
    component: CareerInterviewRoundComponent
  },
  {
    path: 'hired-candidates',
    component: ApprovedCareerPersonComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule { }
