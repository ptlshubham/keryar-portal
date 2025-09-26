import { Component, OnInit } from '@angular/core';

import { ChartType } from './apex.model';
import {
  linewithDataChart, dashedLineChart, splineAreaChart, basicColumChart, columnlabelChart, barChart, lineColumAreaChart, basicRadialBarChart, simplePieChart, donutChart
} from './data';

@Component({
  selector: 'app-apex',
  templateUrl: './apex.component.html',
  styleUrls: ['./apex.component.scss']
})

/**
 * Apex Chart Component
 */
export class ApexComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  linewithDataChart!: ChartType;
  dashedLineChart!: ChartType;
  splineAreaChart!: ChartType;
  basicColumChart!: ChartType;
  columnlabelChart!: ChartType;
  barChart!: ChartType;
  lineColumAreaChart!: ChartType;
  basicRadialBarChart!: ChartType;
  simplePieChart!: ChartType;
  donutChart!: ChartType;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Charts' },
      { label: 'Apexcharts', active: true }
    ];

    /**
     * Fethches the chart data
     */
    this._fetchData();
  }

  /**
   * Fetches the chart data
   */
  private _fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.dashedLineChart = dashedLineChart;
    this.splineAreaChart = splineAreaChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = columnlabelChart;
    this.barChart = barChart;
    this.lineColumAreaChart = lineColumAreaChart;
    this.basicRadialBarChart = basicRadialBarChart;
    this.simplePieChart = simplePieChart;
    this.donutChart = donutChart;
  }

}
