import { Component, OnInit } from '@angular/core';

import { Usergrid } from './blog-grid.model';
import { blogGridData } from './data';

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.scss']
})

/**
 * BlogGrid Component
 */
export class BlogGridComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  blogGridData!: Usergrid[];

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
     this.breadCrumbItems = [
      { label: 'Blog' },
      { label: 'Blog Grid', active: true }
    ];

    this.blogGridData = blogGridData;
  }

}
