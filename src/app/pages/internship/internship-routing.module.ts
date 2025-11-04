import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternshipResultComponent } from './internship-result/internship-result.component';
import { InternshipInterviewRoundComponent } from './internship-interview-round/internship-interview-round.component';
import { ApprovedInternshipStudentsComponent } from './approved-internship-students/approved-internship-students.component';
import { HoldStudentListComponent } from './hold-student-list/hold-student-list.component';
import { FreeStudentListComponent } from './free-student-list/free-student-list.component';
import { PaidStudentListComponent } from './paid-student-list/paid-student-list.component';

const routes: Routes = [
  {
    path: 'internship-result',
    component: InternshipResultComponent
  },
  {
    path: 'free-student-internship',
    component: FreeStudentListComponent
  },
  {
    path: 'paid-student-internship',
    component: PaidStudentListComponent
  },
  {
    path: 'hold-students',
    component: HoldStudentListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternshipRoutingModule { }
