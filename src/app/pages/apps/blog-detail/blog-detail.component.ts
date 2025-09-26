import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})

/**
 * BlogDetail Component
 */
export class BlogDetailComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
     this.breadCrumbItems = [
      { label: 'Blog' },
      { label: 'Blog Details', active: true }
    ];
  }

}
