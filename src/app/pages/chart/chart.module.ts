import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgChartsModule } from 'ng2-charts';

import { SharedModule } from '../../shared/shared.module';
import { ChartRoutingModule } from './chart-routing.module';

import { ApexComponent } from './apex/apex.component';
import { EchartComponent } from './echart/echart.component';
import { ChartjsComponent } from './chartjs/chartjs.component';

@NgModule({
  declarations: [
    ApexComponent,
    EchartComponent,
    ChartjsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgApexchartsModule,
    ChartRoutingModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class ChartModule { }
