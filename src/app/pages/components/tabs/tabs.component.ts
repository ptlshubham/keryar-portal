import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})

/**
 * Tabs Component
 */
export class TabsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public Collapsed = false;
  public firstCollapse = false;
  public secondCollapse = false;
  public bothColleaps = false;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Tabs & Accordions', active: true }
    ];
  }

}
