import { Component, OnInit } from '@angular/core';

import { timelineModel } from './timeline.model';
import { timelineData } from './data';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

/**
 * Timeline Component
 */
export class TimelineComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  timelineData!: timelineModel[];

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Timeline', active: true }
    ];

    // Pricing Data Get Function
    this._fetchData();
  }

  // Pricing Data Fetch
  private _fetchData() {
    this.timelineData = timelineData;
  }

}
