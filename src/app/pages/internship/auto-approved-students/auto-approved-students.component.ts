import { Component, OnInit } from '@angular/core';
import { ConnectService } from 'src/app/core/services/connect.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InternshipService } from 'src/app/core/services/internship.service';

@Component({
  selector: 'app-auto-approved-students',
  templateUrl: './auto-approved-students.component.html',
  styleUrls: ['./auto-approved-students.component.scss']
})
export class AutoApprovedStudentsComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  autoApprovedStudents: any = [];
  filteredStudents: any[] = [];
  selectedStudent: any = null;
  selectedResumeUrl: string = '';
  safeResumeUrl: SafeResourceUrl = '';
  serverBaseUrl = 'https://api.fosterx.co';
  searchText: string = '';
  selectedStudents: Set<number> = new Set();
  selectAll: boolean = false;
  isDeletingBulk = false;

  constructor(
    public connectService: ConnectService,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private internshipService: InternshipService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Auto-Approved Internships', active: true }
    ];
    this.getAutoApprovedStudents();
  }

  getAutoApprovedStudents() {
    this.connectService.getAutoApprovedInternships().subscribe((res: any) => {
      let data: any[] = [];
      if (!res) {
        data = [];
      } else if (Array.isArray(res)) {
        data = res;
      } else if (res.success && Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data)) {
        data = res.data;
      } else if (typeof res === 'object') {
        data = [res];
      }

      this.autoApprovedStudents = data || [];

      for (let i = 0; i < this.autoApprovedStudents.length; i++) {
        this.autoApprovedStudents[i].index = i + 1;
        if (this.autoApprovedStudents[i].resume) {
          this.autoApprovedStudents[i].resume_url = this.serverBaseUrl + this.autoApprovedStudents[i].resume;
        }
      }

      this.filteredStudents = [...this.autoApprovedStudents];
      this.collectionSize = this.filteredStudents.length;
      this.applySearch();
    });
  }

  applySearch() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredStudents = [...this.autoApprovedStudents];
    } else {
      this.filteredStudents = this.autoApprovedStudents.filter((item: any) => (
        (item.firstname && item.firstname.toLowerCase().includes(search)) ||
        (item.lastname && item.lastname.toLowerCase().includes(search)) ||
        (item.email && item.email.toLowerCase().includes(search)) ||
        (item.mobilenumber && item.mobilenumber.toString().includes(search)) ||
        (item.internshiptype && item.internshiptype.toLowerCase().includes(search)) ||
        (item.subject && item.subject.toLowerCase().includes(search)) ||
        (item.collagename && item.collagename.toLowerCase().includes(search)) ||
        (item.college_name && item.college_name.toLowerCase().includes(search)) ||
        (item.institute && item.institute.toLowerCase().includes(search)) ||
        (item.department && item.department.toLowerCase().includes(search)) ||
        (item.dept && item.dept.toLowerCase().includes(search))
      ));
    }
    this.collectionSize = this.filteredStudents.length;
    this.page = 1;
    this.getPagintaion();
  }

  clearSearch() {
    this.searchText = '';
    this.applySearch();
  }

  getPagintaion() {
    this.paginateData = this.filteredStudents
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openPreview(student: any, modalTpl: any) {
    this.selectedStudent = student;
    this.modalService.open(modalTpl, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  removeStudentData(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this student entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.connectService.removeInternshipDetails(id).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'Student deleted successfully.', 'success');
            this.getAutoApprovedStudents();
          },
          error: (err) => {
            this.toastr.error('Failed to delete student.', 'Error');
          }
        });
      }
    });
  }

  toggleSelectStudent(studentId: number, event: any) {
    if (event.target.checked) {
      this.selectedStudents.add(studentId);
    } else {
      this.selectedStudents.delete(studentId);
      this.selectAll = false;
    }
  }

  toggleSelectAll(event: any) {
    this.selectAll = event.target.checked;
    if (this.selectAll) {
      this.paginateData.forEach((student: any) => this.selectedStudents.add(student.id));
    } else {
      this.selectedStudents.clear();
    }
  }

  isSelected(studentId: number): boolean {
    return this.selectedStudents.has(studentId);
  }

  bulkSetManualApproval() {
    if (this.selectedStudents.size === 0) {
      this.toastr.warning('Please select at least one student.');
      return;
    }

    Swal.fire({
      title: 'Set to Manual Approval?',
      text: `Update ${this.selectedStudents.size} student(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update!'
    }).then((result) => {
      if (result.isConfirmed) {
        const promises = Array.from(this.selectedStudents).map(id => {
          const student = this.autoApprovedStudents.find((s: any) => s.id === id);
          const internshiptype = (student && student.internshiptype && String(student.internshiptype).toLowerCase() === 'paid') ? 'free' : undefined;
          const payload: any = { id, autoapproved: false, ishold: 0 };
          if (internshiptype !== undefined) {
            payload.internshiptype = internshiptype;
          }
          return this.connectService.updateInternshipAutoApproved(payload).toPromise();
        });

        Promise.all(promises).then((responses: any[]) => {
          const successCount = responses.filter(res => res.success).length;
          this.toastr.success(`${successCount} student(s) updated!`);
          this.selectedStudents.clear();
          this.selectAll = false;
          this.getAutoApprovedStudents();
        });
      }
    });
  }

  bulkDeleteStudents() {
    if (this.selectedStudents.size === 0) {
      this.toastr.warning('Please select at least one student.');
      return;
    }

    Swal.fire({
      title: 'Delete Selected Students?',
      text: `Permanently delete ${this.selectedStudents.size} student(s)? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDeletingBulk = true;
        const ids = Array.from(this.selectedStudents).map(x => x.toString()).join(',');
        this.connectService.removeInternshipDetails(ids).subscribe({
          next: (res: any) => {
            const msg = res?.message || `${this.selectedStudents.size} student(s) deleted.`;
            Swal.fire('Deleted!', msg, 'success');
            this.selectedStudents.clear();
            this.selectAll = false;
            this.getAutoApprovedStudents();
          },
          error: (err) => {
            console.error('Bulk delete error:', err);
            this.toastr.error('Failed to delete selected students.', 'Error');
          }
        }).add(() => {
          this.isDeletingBulk = false;
        });
      }
    });
  }

  openResumeInNewTab(resumeUrl: string) {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  }

  downloadResume(student: any) {
    const url = student.resume_url || (student.resume ? this.serverBaseUrl + student.resume : null);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${student.firstname}_${student.lastname}_resume.pdf`;
      link.click();
    }
  }

  downloadExcel() {
    if (!this.filteredStudents.length) return;
    const data = this.filteredStudents.map((item: any, i: any) => ({
      '#': i + 1,
      'Name': `${item.firstname || ''}${item.lastname ? ' ' + item.lastname : ''}`.trim() || '-',
      'Created Date': item.createddate ? new Date(item.createddate).toLocaleDateString('en-GB') : '-',
      'Email': item.email || '-',
      'Mobile': item.mobilenumber || '-',
      'College': item.collagename || item.college_name || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Auto-Approved');
    XLSX.writeFile(wb, `Auto_Approved_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  downloadPDF() {
    if (!this.filteredStudents.length) return;
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text('Auto-Approved Students', 14, 15);
    const tableData = this.filteredStudents.map((item: any, i: any) => [
      i + 1,
      `${item.firstname || ''}${item.lastname ? ' ' + item.lastname : ''}`.trim() || '-',
      item.createddate ? new Date(item.createddate).toLocaleDateString('en-GB') : '-',
      item.email || '-',
      item.mobilenumber || '-',
      item.collagename || '-'
    ]);
    autoTable(doc, {
      head: [['#', 'Name', 'Created Date', 'Email', 'Mobile', 'College']],
      body: tableData,
      startY: 25
    });
    doc.save(`Auto_Approved_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
