import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { UserSortableDirective, SortEvent } from './user-list-sortable.directive';
import { UserListService } from './user-list.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { UserList } from './user-list.model';
import { tableData } from './data';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [UserListService, DecimalPipe]
})

/**
 * User List Component
 */
export class UserListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  // headers!: QueryList<UserSortableDirective>;

  @ViewChildren(UserSortableDirective) headers!: QueryList<UserSortableDirective>;

  tables$!: Observable<UserList[]>;
  total$: Observable<number>;
  userForm!: UntypedFormGroup;
  tableData!: UserList[];
  submitted = false;

  constructor(public service: UserListService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
     * fetches data
     */
    this._fetchData();

    /**
     * Form Validation
     */
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Contacts' },
      { label: 'User List', active: true }
    ];
  }

  /**
   * User grid data fetches
   */
  private _fetchData() {
    this.tableData = tableData;
  }

  /**
   * Form Data Fetch
   */
  get form() {
    return this.userForm.controls;
  }

  /**
   * Sort table data
   * @param param0 sort the column
   */
  onSort({ columns, directions }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.userSorTable !== columns) {
        header.directions = '';
      }
    });
    this.service.sortColumn = columns;
    this.service.sortDirection = directions;
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { centered: true });
  }

  /**
  * Save user
  */
  saveUser() {
    if (this.userForm.valid) {
      const name = this.userForm.get('name')?.value;
      const position = this.userForm.get('position')?.value;
      const email = this.userForm.get('email')?.value;
      const tags = this.userForm.get('tags')?.value;
      const image = this.userForm.get('image')?.value;
      this.tableData.push({
        id: this.tableData.length + 1,
        name,
        position,
        email,
        tags,
        image
      })
      this.userForm.reset();
      this.modalService.dismissAll();
    }
    this.submitted = true
  }

}
