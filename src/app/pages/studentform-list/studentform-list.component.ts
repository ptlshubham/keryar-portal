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
  studentData: any[] = [];
  // filteredData is the list after applying search/subject filters
  filteredData: any[] = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  searchText: string = '';
  subjects: string[] = [];
  selectedSubject: string = '';

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

      this.studentData = list || [];

      // assign stable indexes based on the full (unfiltered) dataset
      for (let i = 0; i < this.studentData.length; i++) {
        this.studentData[i].index = i + 1;
      }

      // compute available subjects for the dropdown and apply initial filter
      this.computeSubjects();
      this.applyFilter();
    }, (err: any) => {
      // handle error gracefully
      this.studentData = [];
      this.collectionSize = 0;
      this.paginateData = [];
      console.error('Error fetching student forms:', err);
    })
  }

  getPagintaion() {
    // paginate the filtered data
    this.paginateData = this.filteredData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }


  removeStudentData(id: any) {
    this.commonService.removeStudentFormDetailsById(id).subscribe((res: any) => {
      // Expecting backend to return { success: true, message: ... }
      if (res && res.success) {
        this.toastr.success('Student form deleted successfully.', 'Deleted', { timeOut: 3000 });
        // refresh list and recompute filters
        this.getClients();
      } else {
        this.toastr.error('Failed to delete student form.');
      }
    }, (err: any) => {
      console.error('Error deleting student form:', err);
      this.toastr.error('Something went wrong while deleting.');
    })
  }

  // Build a sorted unique subject list from the full dataset
  computeSubjects() {
    const set = new Set<string>();
    for (const s of this.studentData) {
      if (s && s.subject) set.add(s.subject);
    }
    this.subjects = Array.from(set).sort((a: string, b: string) => a.localeCompare(b));
  }

  // Apply search and subject filters to the studentData and update pagination
  applyFilter() {
    const term = (this.searchText || '').trim().toLowerCase();
    this.filteredData = this.studentData.filter((s: any) => {
      if (this.selectedSubject && s.subject !== this.selectedSubject) return false;
      if (!term) return true;
      const name = `${s.firstname || ''} ${s.lastname || ''}`.toLowerCase();
      const email = (s.email || '').toLowerCase();
      const mobile = (s.mobilenumber || '').toString().toLowerCase();
      const subject = (s.subject || '').toLowerCase();
      return name.includes(term) || email.includes(term) || mobile.includes(term) || subject.includes(term);
    });

    this.collectionSize = this.filteredData.length;
    // ensure page is within bounds
    const maxPage = Math.max(1, Math.ceil(this.collectionSize / this.pageSize));
    if (this.page > maxPage) this.page = maxPage;
    this.getPagintaion();
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.page = 1;
    this.applyFilter();
  }

  onSubjectChange(value: string) {
    this.selectedSubject = value;
    this.page = 1;
    this.applyFilter();
  }
}

