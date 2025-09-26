import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';

import { Usergrid } from './usergrid.model';
import { userGridData } from './data';

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss']
})

/**
 * User Grid Component
 */
export class UserGridComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  userGridData!: Usergrid[];
  totalRecords = 0;
  startIndex = 1;
  endIndex = 8;
  page = 1;
  pageSize = 8;
  selected: any;
  userForm!: UntypedFormGroup;
  submitted = false;
  items!: UntypedFormArray;

  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.totalRecords = userGridData.length;
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Contacts' },
      { label: 'User Grid', active: true }
    ];

    /**
     * fetches data
     */
    this._fetchData();

    /**
     * Form Validation
     */
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]]
    });
  }

  /**
   * User grid data fetches
   */
  private _fetchData() {
    this.userGridData = userGridData;
  }

  get form() {
    return this.userForm.controls;
  }

  /**
   * Handle on page click event
   */
  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize + 1;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.userGridData = userGridData.slice(this.startIndex - 1, this.endIndex - 1);
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
      const designation = this.userForm.get('designation')?.value;
      this.userGridData.push({
        id: this.userGridData.length + 1,
        name,
        designation
      })
      this.modalService.dismissAll();
      this.userForm.reset();
    }
    this.submitted = true;
  }
 
}
