import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})

/**
 * General Component
 */
export class GeneralComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  page = 1;
  pages = 2;
  largepage = 1;
  smallpage = 2;
  alignpage1 = 1;
  alignpage2 = 2;
  default = 1;
  defaultwithicon = 2;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'General', active: true }
    ];
  }

}
