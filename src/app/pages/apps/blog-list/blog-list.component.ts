import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})

/**
 * BlogList Component
 */
export class BlogListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
     this.breadCrumbItems = [
      { label: 'Blog' },
      { label: 'Blog List', active: true }
    ];
  }

}
