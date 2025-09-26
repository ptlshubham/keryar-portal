import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { IconsRoutingModule } from './icons-routing.module';
import { BoxiconsComponent } from './boxicons/boxicons.component';
import { MaterialdesignComponent } from './materialdesign/materialdesign.component';
import { DripiconsComponent } from './dripicons/dripicons.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';

@NgModule({
  declarations: [
    BoxiconsComponent,
    MaterialdesignComponent,
    DripiconsComponent,
    FontawesomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IconsRoutingModule
  ]
})
export class IconsModule { }
