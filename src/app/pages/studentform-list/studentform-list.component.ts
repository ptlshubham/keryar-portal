import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { CommonSevice } from 'src/app/core/services/common.service';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';

@Component({
  selector: 'app-studentform-list',
  templateUrl: './studentform-list.component.html',
  styleUrl: './studentform-list.component.scss'
})
export class StudentformListComponent {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;
  studentData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    public toastr: ToastrService,
    public commonService: CommonSevice,
    public router: Router,
    public formBuilder: UntypedFormBuilder,
  ) {
    this.getClients();
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Student Form List', active: true }
    ];
  }

  get f() { return this.validationForm.controls; }

  getClients() {
    this.commonService.getStudentFormDetails().subscribe((res: any) => {
      // Backend may return { success: true, data: [...] } or directly an array.
      const list = Array.isArray(res) ? res : (res && res.data) ? res.data : [];

      this.studentData = list;

      for (let i = 0; i < this.studentData.length; i++) {
        this.studentData[i].index = i + 1;
      }
      this.collectionSize = this.studentData.length;
      this.getPagintaion();
    }, (err: any) => {
      // handle error gracefully
      this.studentData = [];
      this.collectionSize = 0;
      this.paginateData = [];
      console.error('Error fetching student forms:', err);
    })
  }

  getPagintaion() {
    this.paginateData = this.studentData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }


  removeStudentData(id: any) {
    this.commonService.removeStudentFormDetailsById(id).subscribe((res: any) => {
      // Expecting backend to return { success: true, message: ... }
      if (res && res.success) {
        this.toastr.success('Student form deleted successfully.', 'Deleted', { timeOut: 3000 });
        this.getClients();
      } else {
        this.toastr.error('Failed to delete student form.');
      }
    }, (err: any) => {
      console.error('Error deleting student form:', err);
      this.toastr.error('Something went wrong while deleting.');
    })
  }
}

