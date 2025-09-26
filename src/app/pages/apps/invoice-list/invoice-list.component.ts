import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceListSortableDirective, SortEvent } from './Invoice-sortable.directive';
import { InvoiceListService } from './invoice-list.service';
import { DecimalPipe } from '@angular/common';

import { Table } from './invoice-list.model';
import { tableData } from './data';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [InvoiceListService, DecimalPipe]
})

/**
 * Invoice List Component
 */
export class InvoiceListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  @ViewChildren(InvoiceListSortableDirective) headers!: QueryList<InvoiceListSortableDirective>;
  tableData!: Table[];
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;

  constructor(public service: InvoiceListService) {

    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /***
     * All Data Get
     */
    this._fetchData();

    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Invoices' },
      { label: 'Invoice List', active: true }
    ];
  }

  /**
   * fetches the table value
   */
  _fetchData() {
    this.tableData = tableData;
    for (let i = 0; i <= this.tableData.length; i++) {
      this.hideme.push(true);
    }
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
