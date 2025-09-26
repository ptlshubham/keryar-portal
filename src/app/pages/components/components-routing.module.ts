import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertsComponent } from './alerts/alerts.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './cards/cards.component';
import { CarouselComponent } from './carousel/carousel.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { GridComponent } from './grid/grid.component';
import { ImagesComponent } from './images/images.component';
import { ModalsComponent } from './modals/modals.component';
import { ProgressbarsComponent } from './progressbars/progressbars.component';
import { TabsComponent } from './tabs/tabs.component';
import { TypographyComponent } from './typography/typography.component';
import { ToastsComponent } from "./toasts/toasts.component";
import { VideoComponent } from './video/video.component';
import { GeneralComponent } from './general/general.component';
import { ColorsComponent } from './colors/colors.component';
import { OffcanvasComponent } from "./offcanvas/offcanvas.component";
import { PlaceholdersComponent } from "./placeholders/placeholders.component";
import { UtilitiesComponent } from "./utilities/utilities.component";

const routes: Routes = [
    {
        path: 'alerts',
        component: AlertsComponent
    },
    {
        path: 'buttons',
        component: ButtonsComponent
    },
    {
        path: 'cards',
        component: CardsComponent
    },
    {
        path: 'carousel',
        component: CarouselComponent
    },
    {
        path: 'dropdowns',
        component: DropdownsComponent
    },
    {
        path: 'grid',
        component: GridComponent
    },
    {
        path: 'images',
        component: ImagesComponent
    },
    {
        path: 'modals',
        component: ModalsComponent
    },
    {
        path: 'progressbars',
        component: ProgressbarsComponent
    },
    {
        path: 'tabs-accordions',
        component: TabsComponent
    },
    {
        path: 'typography',
        component: TypographyComponent
    },
    {
        path: 'toasts',
        component: ToastsComponent
    },
    {
        path: 'video',
        component: VideoComponent
    },
    {
        path: 'general',
        component: GeneralComponent
    },
    {
        path: 'colors',
        component: ColorsComponent
    },
    {
        path:'Offcanvas',
        component:OffcanvasComponent
    },
    {
        path:'placeholders',
        component:PlaceholdersComponent
    },
    {
        path:'utilities',
        component:UtilitiesComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ComponentsRoutingModule { }
