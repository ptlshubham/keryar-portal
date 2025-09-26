import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { dataTableSortableDirective, SortEvent } from './datatable-sortable.directive';
import { DataTableService } from './datatable.service';
import { DecimalPipe } from '@angular/common';

import { Table } from './datatable.model';
import { tableData } from './data';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [DataTableService, DecimalPipe]
})

/**
 * Datatable Component
 */
export class DatatableComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  @ViewChildren(dataTableSortableDirective)
  headers!: QueryList<dataTableSortableDirective>;
  tableData!: Table[];
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;

  constructor(public service: DataTableService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'DataTables', active: true }
    ];

    /***
     * All Data Get
     */
    this._fetchData();
  }

  /**
   * fetches the table value
   */
  _fetchData() {
    this.tableData = this.tableData;
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
