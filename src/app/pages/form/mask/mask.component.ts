import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.scss']
})

/**
 * mask Component
 */
export class MaskComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb Set
    */
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Form Mask', active: true }
    ];
  }

}
