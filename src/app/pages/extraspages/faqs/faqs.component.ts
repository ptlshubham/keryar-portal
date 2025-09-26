import { Component, OnInit } from '@angular/core';

import { faqsModel } from './faqs.model';
import { FaqsData } from './data';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})

/**
 * FAQs Component
 */
export class FaqsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  FaqsData!: faqsModel[];

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'FAQs', active: true }
    ];

    // Pricing Data Get Function
    this._fetchData();
  }

  // Pricing Data Fetch
  private _fetchData() {
    this.FaqsData = FaqsData;
  }

}
