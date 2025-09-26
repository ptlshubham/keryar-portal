import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})

/**
 * Invoice Detail Component
 */
export class InvoiceDetailComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Invoices' },
      { label: 'Invoice Detail', active: true }
    ];
  }

}
