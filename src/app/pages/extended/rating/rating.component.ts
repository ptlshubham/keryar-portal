import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})

/**
 * Rating Component
 */
export class RatingComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  currentRate = 2;
  defaultSelect = 1;
  hovered = 0;
  readonly = false;
  customColor = 4;

  constructor() {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Extended' },
      { label: 'Rating', active: true }
    ];
  }

}
