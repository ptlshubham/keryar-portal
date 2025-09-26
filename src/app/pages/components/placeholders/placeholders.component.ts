import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-placeholders',
  templateUrl: './placeholders.component.html',
  styleUrls: ['./placeholders.component.scss']
})

/**
 * Placeholders Component
 */
export class PlaceholdersComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
     this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Placeholders', active: true }
    ];
  }

}
