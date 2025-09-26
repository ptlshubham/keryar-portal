import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

/**
 * Grid Component
 */
export class GridComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb Set
    */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Grid', active: true }
    ];
  }

}
