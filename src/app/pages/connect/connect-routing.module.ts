import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternshipComponent } from './internship/internship.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path: 'internship',
    component: InternshipComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectRoutingModule { }
