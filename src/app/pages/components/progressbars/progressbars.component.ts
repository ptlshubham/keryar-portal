import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progressbars',
  templateUrl: './progressbars.component.html',
  styleUrls: ['./progressbars.component.scss']
})

/**
 * Progress bars Component
 */
export class ProgressbarsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Progress Bars', active: true }
    ];
  }

}
