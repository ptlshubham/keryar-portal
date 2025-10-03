import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternshipComponent } from './internship/internship.component';

const routes: Routes = [
  {
    path: 'internship',
    component: InternshipComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectRoutingModule { }
