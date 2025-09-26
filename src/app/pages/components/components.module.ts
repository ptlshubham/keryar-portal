import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  NgbDropdownModule, NgbAlertModule,
  NgbCarouselModule, NgbProgressbarModule,
  NgbNavModule, NgbCollapseModule,
  NgbAccordionModule, NgbPopoverModule,
  NgbTooltipModule, NgbPaginationModule, NgbToastModule
} from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';

import { ComponentsRoutingModule } from './components-routing.module';
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
import { VideoComponent } from './video/video.component';
import { GeneralComponent } from './general/general.component';
import { ColorsComponent } from './colors/colors.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { PlaceholdersComponent } from './placeholders/placeholders.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { ToastsComponent } from './toasts/toasts.component';

import { ToastsContainer } from './toasts/toasts-container.component';

@NgModule({
  declarations: [
    AlertsComponent,
    ButtonsComponent,
    CardsComponent,
    CarouselComponent,
    DropdownsComponent,
    GridComponent,
    ImagesComponent,
    ModalsComponent,
    ProgressbarsComponent,
    TabsComponent,
    TypographyComponent,
    VideoComponent,
    GeneralComponent,
    ColorsComponent,
    OffcanvasComponent,
    PlaceholdersComponent,
    UtilitiesComponent,
    ToastsComponent,
    ToastsContainer
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbToastModule,
    SharedModule,
    ComponentsRoutingModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
