import { Component, OnInit } from '@angular/core';

import { monthlyPlan, yearlyPlan } from './pricing.model';
import { monthlyData, yearlyData } from './data';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})

/**
 * Pricing Component
 */
export class PricingComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  monthlyData!: monthlyPlan[];
  yearlyData!: yearlyPlan[];

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Pricing', active: true }
    ];

    // Pricing Data Get Function
    this._fetchData();
  }

  // Pricing Data Fetch
  private _fetchData() {
    this.monthlyData = monthlyData;
    this.yearlyData = yearlyData;
  }

}
