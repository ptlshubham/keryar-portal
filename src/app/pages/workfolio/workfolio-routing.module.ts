import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
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
    {
        path: 'casestudy',
        component: CaseStudiesComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WorkfolioRoutingModule { }
