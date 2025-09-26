import { Component, OnInit } from '@angular/core';

import { lineChart, lineBarChart, donughnutChart, pieChart, scatterChart, bubbleChart, customizepieChart, gaugeChart } from './data';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.scss']
})

/**
 * E-chart Component
 */
export class EchartComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  lineChart!: EChartsOption;
  lineBarChart!: EChartsOption;
  donughnutChart!: EChartsOption;
  pieChart!: EChartsOption;
  scatterChart!: EChartsOption;
  bubbleChart!: EChartsOption;
  customizepieChart!: EChartsOption;
  gaugeChart!: EChartsOption;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Charts' },
      { label: 'E - chart', active: true }
    ];

    this._fetchData();
  }

  /**
   * Fetch the chart data
   */
  private _fetchData() {
    this.lineChart = lineChart;
    this.donughnutChart = donughnutChart;
    this.lineBarChart = lineBarChart;
    this.pieChart = pieChart;
    this.scatterChart = scatterChart;
    this.bubbleChart = bubbleChart;
    this.customizepieChart = customizepieChart;
    this.gaugeChart = gaugeChart;
  }

}
