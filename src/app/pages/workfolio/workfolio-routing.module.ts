import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PortfolioComponent } from './portfolio/portfolio.component';


const routes: Routes = [
    {
        path: 'clients',
        component: ClientsComponent
    },
    {
        path: 'testimonials',
        component: TestimonialsComponent
    },
    {
        path: 'portfolio',
        component: PortfolioComponent
    },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WorkfolioRoutingModule { }
