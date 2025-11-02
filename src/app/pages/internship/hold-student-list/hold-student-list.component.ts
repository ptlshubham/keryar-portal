import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InternshipService } from 'src/app/core/services/internship.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs'; // Add this import for handling multiple updates

enum AssessmentStatus {
  Pending = 'pending',
  Passed = 'passed',  // Changed to match result component's 'passed'
  Failed = 'failed'   // Changed to match result component's 'failed'
}

interface WorksheetRow {
  '#': number;
  'Student Name': string;
  'Email': string;
  'Mobile Number': string;
  'College Name': string;
  'Department': string;
  'Subject': string;
  'Status': string;
  'Total Marks': number;
  'Obtained Marks': number;
  'Remarks': string;
}

@Component({
  selector: 'app-hold-student-list',
  templateUrl: './hold-student-list.component.html',
  styleUrls: ['./hold-student-list.component.scss']
})
export class HoldStudentListComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  students: any[] = [];
  paginateData: any[] = [];
  filteredStudents: any[] = [];
  selectedStudent: any | null = null;
  filterStatus: string = '';
  searchTerm: string = '';
  filterCollege: string = '';
  colleges: string[] = [];
  selectedDate: string = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  isLoadingPreview = false;
  isHiring = false;
  isRejecting = false;
  isRemoving = false;
  isSavingRemarks = false;
  private modalRef?: NgbModalRef;
  assessmentStatus = AssessmentStatus;
  safeResumeUrl?: SafeResourceUrl;

  // New properties for multi-selection and status change
  selectedIds: Set<string> = new Set<string>();
  selectedStatus: AssessmentStatus = AssessmentStatus.Pending;
  selectedStudentStatus: 'free' | 'paid' | 'hold' = 'free';
  isChangingStatus = false;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private internshipService: InternshipService,
    private sanitizer: DomSanitizer
  ) { }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Hold Internship Students', active: true }
    ];
    this.loadApprovedStudents();
  }

  loadApprovedStudents() {
    this.internshipService.getHoldInternshipStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            calculated_marks: item.obtained_marks ?? 0,
            total_marks: item.total_marks ?? 0
          }));
          this.colleges = [...new Set(this.students.map(student => student.internship.collagename).filter(college => college))].sort();

          // Fetch detailed assessment data to calculate marks
          this.students.forEach(student => {
            this.internshipService.getInternshipAssessmentPreview(student.assessment_id).subscribe({
              next: (previewResponse) => {
                if (previewResponse.success) {
                  student.answers = previewResponse.data.answers || [];
                  this.calculateQuestionMarks(student);
                }
              },
              error: (err) => {
                console.error('Error fetching preview for student:', student.assessment_id, err);
              }
            });
          });
          this.applyFilters();
        } else {
          this.toastr.error(response.message || 'Failed to fetch hold students');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching students: ' + (err.error?.message || err.message));
      }
    });
  }

  calculateQuestionMarks(student: any) {
    if (!student || !student.answers) {
      student.calculated_marks = 0;
      return;
    }

    let totalObtainedMarks = 0;

    student.answers = student.answers.map((answer: any) => {
      let questionMarks = 0;

      if (answer.option_type === 'Checkbox') {
        if (Array.isArray(answer.answer)) {
          questionMarks = answer.optionsArr
            .filter((opt: any, index: number) => this.isOptionSelected(answer.answer, index, opt.value))
            .reduce((sum: number, opt: any) => sum + Number(opt.value || 0), 0);
        }
      } else if (answer.option_type === 'Radio') {
        const selectedOption = answer.optionsArr.find((opt: any, index: number) =>
          this.isRadioSelected(answer.answer, index, opt.value)
        );
        questionMarks = selectedOption ? Number(selectedOption.value || 0) : 0;
      } else if (answer.option_type === 'Input' || answer.option_type === 'Textarea') {
        questionMarks = answer.is_correct === 1 ? Number(answer.weight || 0) : 0;
      }

      answer.calculatedMarks = questionMarks;
      totalObtainedMarks += questionMarks;

      return answer;
    });

    student.calculated_marks = totalObtainedMarks;
  }

  applyFilters() {
    let filteredStudents = [...this.students];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredStudents = filteredStudents.filter(student =>
        student.internship.name.toLowerCase().includes(searchLower) ||
        student.internship.email.toLowerCase().includes(searchLower) ||
        student.internship.collagename.toLowerCase().includes(searchLower)
      );
    }

    if (this.filterCollege) {
      filteredStudents = filteredStudents.filter(student =>
        student.internship.collagename.toLowerCase() === this.filterCollege.toLowerCase()
      );
    }

    if (this.selectedDate) {
      const selected = new Date(this.selectedDate);
      const selectedDateStr = selected.toISOString().split('T')[0];
      filteredStudents = filteredStudents.filter(student => {
        const studentDate = new Date(student.createddate);
        const studentDateStr = studentDate.toISOString().split('T')[0];
        return studentDateStr === selectedDateStr;
      });
    }

    if (this.filterStatus) {
      filteredStudents = filteredStudents.filter(student =>
        student.status === this.filterStatus
      );
    }

    this.filteredStudents = filteredStudents;
    this.collectionSize = filteredStudents.length;
    this.getPagination();
  }

  getPagination() {
    this.paginateData = this.filteredStudents.slice(
      (this.page - 1) * this.pageSize,
      (this.page * this.pageSize)
    );
  }

  filterByStatus(status: string) {
    this.filterStatus = status;
    this.page = 1;
    this.applyFilters();
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  onCollegeChange() {
    this.page = 1;
    this.applyFilters();
  }

  onDateChange() {
    this.page = 1;
    this.applyFilters();
  }

  openPreviewModal(modal: any, student: any) {
    this.isLoadingPreview = true;
    this.selectedStudent = null;
    this.safeResumeUrl = undefined;

    this.internshipService.getInternshipAssessmentPreview(student.assessment_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedStudent = {
            ...student,
            ...response.data,
            answers: response.data.answers || [],
            calculated_marks: student.calculated_marks ?? response.data.obtained_marks ?? 0,
            total_marks: response.data.total_marks ?? student.total_marks ?? 0
          };

          this.calculateQuestionMarks(this.selectedStudent);

          // Handle resume URL
          const resumeUrl: string | null =
            this.selectedStudent?.internship?.resume && typeof this.selectedStudent.internship.resume === 'string'
              ? this.selectedStudent.internship.resume
              : null;

          if (resumeUrl) {
            let fullResumeUrl: string;
            if (resumeUrl.startsWith('/')) {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            } else if (!resumeUrl.startsWith('http')) {
              fullResumeUrl = `https://api.fosterx.co/${resumeUrl}`;
            } else {
              fullResumeUrl = resumeUrl;
            }

            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullResumeUrl);
            this.selectedStudent.internship.resume = fullResumeUrl;
          }

          this.modalRef = this.modalService.open(modal, {
            size: 'xl',
            centered: true,
            scrollable: true,
            backdrop: 'static'
          });
        } else {
          this.toastr.error(response.message || 'Failed to load preview');
        }
      },
      error: (err) => {
        this.toastr.error('Error loading preview: ' + (err.error?.message || err.message));
      }
    }).add(() => {
      this.isLoadingPreview = false;
    });
  }

  closeModal() {
    this.modalRef?.close();
    this.selectedStudent = null;
    this.isLoadingPreview = false;
    this.safeResumeUrl = undefined;
  }

  saveRemarks() {
    if (!this.selectedStudent || !this.selectedStudent.assessment_id) {
      this.toastr.error('No student selected');
      return;
    }

    this.isSavingRemarks = true;
    this.internshipService.updateInternshipRemarks(this.selectedStudent.assessment_id, this.selectedStudent.remarks).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message || 'Remarks saved successfully');
          this.loadApprovedStudents();
        } else {
          this.toastr.error(response.message || 'Failed to save remarks');
        }
      },
      error: (err) => {
        this.toastr.error('Error saving remarks: ' + (err.error?.message || err.message));
      },
      complete: () => {
        this.isSavingRemarks = false;
      }
    });
  }

  hireStudent(studentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to mark this student as Approved for internship?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, hire them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isHiring = true;
        this.internshipService.updateInternshipInterviewStatus({ id: studentId, interviewround: AssessmentStatus.Passed }).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student marked as Approved');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to mark as Approved');
            }
          },
          error: (err) => {
            this.toastr.error('Error marking as Approved: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isHiring = false;
          }
        });
      }
    });
  }

  rejectStudent(studentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this student for internship?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRejecting = true;
        this.internshipService.updateInternshipInterviewStatus({ id: studentId, interviewround: AssessmentStatus.Failed }).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student marked as rejected');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to mark as rejected');
            }
          },
          error: (err) => {
            this.toastr.error('Error marking as rejected: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isRejecting = false;
          }
        });
      }
    });
  }

  removeStudent(studentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this student? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRemoving = true;
        this.internshipService.removeInternshipInterviewStudent(studentId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student removed successfully');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to remove student');
            }
          },
          error: (err) => {
            this.toastr.error('Error removing student: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isRemoving = false;
          }
        });
      }
    });
  }

  downloadPdf() {
    if (this.filteredStudents.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const today = new Date();
    const instituteName = this.filterCollege || 'All Institutes';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Hold Internship Students Report', pageWidth / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Prepared for: ${instituteName}`, pageWidth / 2, 70, { align: 'center' });

    doc.addPage();

    const headers = ['#', 'Student Name', 'Email', 'College', 'Department', 'Subject', 'Total Marks', 'Obtained Marks', 'Status', 'Remarks'];
    const body = this.filteredStudents.map((student, index) => [
      index + 1,
      student.internship.name || 'N/A',
      student.internship.email || 'N/A',
      student.internship.collagename || 'N/A',
      student.internship.department || 'N/A',
      student.internship.subject || 'N/A',
      student.total_marks || 0,
      student.calculated_marks || 0,
      student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Pending',
      student.remarks || 'N/A'
    ]);

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 40,
      theme: 'grid'
    });

    doc.save(`hold-internship-students-report-${this.getCurrentDateString()}.pdf`);
  }

  downloadExcel() {
    if (this.filteredStudents.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const worksheetData: WorksheetRow[] = this.filteredStudents.map((student, index) => ({
      '#': index + 1,
      'Student Name': student.internship.name || 'N/A',
      'Email': student.internship.email || 'N/A',
      'Mobile Number': student.internship.mobilenumber || 'N/A',
      'College Name': student.internship.collagename || 'N/A',
      'Department': student.internship.department || 'N/A',
      'Subject': student.internship.subject || 'N/A',
      'Status': student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Pending',
      'Total Marks': student.total_marks || 0,
      'Obtained Marks': student.calculated_marks || 0,
      'Remarks': student.remarks || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HoldInternshipStudents');
    XLSX.writeFile(workbook, `hold-internship-students-report-${this.getCurrentDateString()}.xlsx`);
  }

  private getCurrentDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  trackById(_: number, item: any) {
    return item.assessment_id;
  }

  isOptionSelected(answer: any, optionIndex: number, optionValue: any): boolean {
    if (!answer) return false;
    if (Array.isArray(answer)) {
      return answer.includes(optionIndex) || answer.includes(optionValue) || answer.includes(optionIndex.toString());
    }
    return false;
  }

  isRadioSelected(answer: any, optionIndex: number, optionValue: any): boolean {
    if (answer === null || answer === undefined) return false;
    return answer === optionIndex || answer === optionValue || answer === optionIndex.toString();
  }

  // New methods for multi-selection
  selectionArray(): string[] {
    return Array.from(this.selectedIds);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleSelection(event: any, id: string) {
    if (event.target.checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  isAllSelected(): boolean {
    const visibleIds = this.paginateData.map(i => i.assessment_id);
    return visibleIds.length > 0 && visibleIds.every(id => this.selectedIds.has(id));
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visibleIds = this.paginateData.map(i => i.assessment_id);
    if (checked) {
      visibleIds.forEach(id => this.selectedIds.add(id));
    } else {
      visibleIds.forEach(id => this.selectedIds.delete(id));
    }
  }

  hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  // Updated method to handle single or multi-selection like in result component
  openChangeStatusModal(modal: any, student?: any) {
    if (student) {
      // Single student selection
      this.selectedIds = new Set<string>([student.assessment_id]);
      this.selectedStatus = student.status ? student.status as AssessmentStatus : AssessmentStatus.Pending;
      this.selectedStudentStatus = student.studentstatus || 'free'; // Assuming studentstatus exists
    } else {
      // Multi-selection or default
      this.selectedStatus = AssessmentStatus.Pending;
      this.selectedStudentStatus = 'free';
    }
    this.modalRef = this.modalService.open(modal, {
      size: 'md',
      centered: true,
      backdrop: 'static'
    });
  }

  // New method to change status for selected students
  changeSelectedStatus(modalRef?: NgbModalRef) {
    if (!this.hasSelection()) {
      this.toastr.error('No students selected');
      return;
    }
    const ids = this.selectionArray();
    this.isChangingStatus = true;

    // Use the same API as in the result component
    const observables = ids.map(id =>
      this.internshipService.updateInternshipAssessmentStatus(id, this.selectedStatus, this.selectedStudentStatus)
    );

    forkJoin(observables).subscribe({
      next: (results: any[]) => {
        this.toastr.success('Selected student(s) status updated');
        this.selectedIds.clear();
        this.loadApprovedStudents();
        if (modalRef) {
          modalRef.close();
        }
      },
      error: (err) => {
        this.toastr.error('Error updating selected students: ' + (err.error?.message || err.message));
      }
    }).add(() => {
      this.isChangingStatus = false;
    });
  }

  // New helper to get student name by ID
  getStudentNameById(id: string): string | null {
    const found = this.students.find(s => s.assessment_id === id) || this.paginateData.find(s => s.assessment_id === id);
    return found ? (found.internship?.name || null) : null;
  }
}
