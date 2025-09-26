import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})

/**
 * Typography Component
 */
export class TypographyComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Typography', active: true }
    ];
  }

}
