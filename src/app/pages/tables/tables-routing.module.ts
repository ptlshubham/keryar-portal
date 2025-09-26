import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicComponent } from './basic/basic.component';
import { DatatableComponent } from './datatable/datatable.component';

const routes: Routes = [
    {
        path: 'basic',
        component: BasicComponent
    },
    {
        path: 'datatable',
        component: DatatableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TablesRoutingModule { }
