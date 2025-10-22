import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternshipResultComponent } from './internship-result/internship-result.component';
import { InternshipInterviewRoundComponent } from './internship-interview-round/internship-interview-round.component';
import { ApprovedInternshipStudentsComponent } from './approved-internship-students/approved-internship-students.component';

const routes: Routes = [
  {
    path: 'internship-result',
    component: InternshipResultComponent
  },
  {
    path: 'interview-round',
    component: InternshipInterviewRoundComponent
  },
  {
    path: 'approved-students',
    component: ApprovedInternshipStudentsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternshipRoutingModule { }
