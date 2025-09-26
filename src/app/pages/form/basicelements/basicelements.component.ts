import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basicelements',
  templateUrl: './basicelements.component.html',
  styleUrls: ['./basicelements.component.scss']
})

/**
 * Basic-Elements Component
 */
export class BasicelementsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Basic Elements', active: true }
    ];
  }

}
