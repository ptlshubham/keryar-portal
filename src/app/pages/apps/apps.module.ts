import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsRoutingModule } from './apps-routing.module';

import { FullCalendarModule } from '@fullcalendar/angular';

// import { FullCalendarModule } from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';

import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTypeaheadModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { ReademailComponent } from './reademail/reademail.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceListSortableDirective } from './invoice-list/Invoice-sortable.directive';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { UserGridComponent } from './user-grid/user-grid.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserSortableDirective } from './user-list/user-list-sortable.directive';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BlogGridComponent } from './blog-grid/blog-grid.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin
// ]);
@NgModule({
  declarations: [
    CalendarComponent,
    ChatComponent,
    InboxComponent,
    ReademailComponent,
    InvoiceListComponent,
    InvoiceListSortableDirective,
    InvoiceDetailComponent,
    UserGridComponent,
    UserListComponent,
    UserSortableDirective,
    UserProfileComponent,
    BlogGridComponent,
    BlogListComponent,
    BlogDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppsRoutingModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    SimplebarAngularModule,
    CKEditorModule,
    NgbTypeaheadModule,
    NgbDatepickerModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppsModule { }
