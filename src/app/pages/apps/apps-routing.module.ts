import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { ReademailComponent } from './reademail/reademail.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { UserGridComponent } from './user-grid/user-grid.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BlogGridComponent } from "./blog-grid/blog-grid.component";
import { BlogListComponent } from "./blog-list/blog-list.component";
import { BlogDetailComponent } from "./blog-detail/blog-detail.component";

const routes: Routes = [
  {
    path: 'calender',
    component: CalendarComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'inbox',
    component: InboxComponent
  },
  {
    path: 'read/:id',
    component: ReademailComponent
  },
  {
    path: 'invoice-list',
    component: InvoiceListComponent
  },
  {
    path: 'invoice-detail',
    component: InvoiceDetailComponent
  },
  {
    path: 'user-grid',
    component: UserGridComponent
  },
  {
    path: 'user-list',
    component: UserListComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent
  },
  {
    path:'blog-grid',
    component:BlogGridComponent
  },
  {
    path:'blog-list',
    component:BlogListComponent
  },
  {
    path:'blog-detail',
    component:BlogDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
