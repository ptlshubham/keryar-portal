import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss']
})

/**
 * Utilities Component
 */
export class UtilitiesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
     this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Utilities', active: true }
    ];
  }

}
