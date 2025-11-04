import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InternshipService } from 'src/app/core/services/internship.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

enum AssessmentStatus {
  Pending = 'pending',
  Passed = 'passed',
  Failed = 'failed'
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
  'Student Status': string; // added student status column
  'Total Marks': number;
  'Obtained Marks': number;
}

@Component({
  selector: 'app-internship-result',
  templateUrl: './internship-result.component.html',
  styleUrl: './internship-result.component.scss'
})
export class InternshipResultComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  assessments: any[] = [];
  paginateData: any[] = [];
  filteredAssessments: any[] = [];
  selectedAssessment: any | null = null;
  filterStatus: string = '';
  searchTerm: string = '';
  filterCollege: string = '';
  colleges: string[] = [];
  selectedDate: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  isLoadingPreview = false;
  isApproving = false;
  isRejecting = false;
  isRemoving = false;
  private modalRef?: NgbModalRef;
  assessmentStatus = AssessmentStatus;
  safeResumeUrl?: SafeResourceUrl;

  // selection state for multi-approve
  selectedIds: Set<string> = new Set<string>();
  selectedStudentStatus: 'free' | 'paid' | 'hold' = 'free';

  // NEW: selected status to apply (Pending/Passed/Failed)
  selectedStatus: AssessmentStatus = AssessmentStatus.Passed;

  // expose template ref for approve modal
  @ViewChild('approveModal') approveModalTemplateRef?: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private internshipService: InternshipService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Internship Results', active: true }
    ];
    this.loadAssessments();
  }

  loadAssessments() {
    this.internshipService.getAllInternshipAssessments(this.filterStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.assessments = response.data.map((item: any, index: number) => ({
            ...item,
            // Map 'student' property to 'internship' for consistency with template
            internship: item.student || item.internship || {},
            index: index + 1,
            calculated_marks: item.obtained_marks || 0
          }));
          this.colleges = [...new Set(this.assessments.map(assessment => assessment.internship?.collagename).filter(college => college))].sort();
          this.applyFilters();
        } else {
          this.toastr.error(response.message || 'Failed to fetch assessments');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching assessments: ' + (err.error?.message || err.message));
      }
    });
  }

  applyFilters() {
    let filteredAssessments = [...this.assessments];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.internship?.name?.toLowerCase().includes(searchLower) ||
        assessment.internship?.email?.toLowerCase().includes(searchLower) ||
        assessment.internship?.collagename?.toLowerCase().includes(searchLower)
      );
    }

    if (this.filterCollege) {
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.internship?.collagename?.toLowerCase() === this.filterCollege.toLowerCase()
      );
    }

    if (this.selectedDate) {
      const selected = new Date(this.selectedDate);
      const selectedDateStr = selected.toISOString().split('T')[0];
      filteredAssessments = filteredAssessments.filter(assessment => {
        const assessmentDate = new Date(assessment.createddate);
        const assessmentDateStr = assessmentDate.toISOString().split('T')[0];
        return assessmentDateStr === selectedDateStr;
      });
    }

    if (this.filterStatus) {
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.status === this.filterStatus
      );
    }

    // Apply sorting
    if (this.sortColumn) {
      filteredAssessments.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (this.sortColumn) {
          case 'name':
            aValue = a.internship?.name?.toLowerCase() || '';
            bValue = b.internship?.name?.toLowerCase() || '';
            break;
          case 'email':
            aValue = a.internship?.email?.toLowerCase() || '';
            bValue = b.internship?.email?.toLowerCase() || '';
            break;
          case 'college':
            aValue = a.internship?.collagename?.toLowerCase() || '';
            bValue = b.internship?.collagename?.toLowerCase() || '';
            break;
          case 'department':
            aValue = a.internship?.department?.toLowerCase() || '';
            bValue = b.internship?.department?.toLowerCase() || '';
            break;
          case 'subject':
            aValue = a.internship?.subject?.toLowerCase() || '';
            bValue = b.internship?.subject?.toLowerCase() || '';
            break;
          case 'status':
            aValue = a.status?.toLowerCase() || '';
            bValue = b.status?.toLowerCase() || '';
            break;
          case 'marks':
            const aPercentage = a.total_marks > 0 ? (a.calculated_marks / a.total_marks) * 100 : 0;
            const bPercentage = b.total_marks > 0 ? (b.calculated_marks / b.total_marks) * 100 : 0;
            aValue = aPercentage;
            bValue = bPercentage;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.filteredAssessments = filteredAssessments;
    this.collectionSize = filteredAssessments.length;
    this.getPagination();
  }

  getPagination() {
    this.paginateData = this.filteredAssessments.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
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

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.page = 1;
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'mdi-sort';
    }
    return this.sortDirection === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending';
  }

  openPreviewModal(modal: any, assessment: any) {
    this.isLoadingPreview = true;
    this.selectedAssessment = null;
    this.safeResumeUrl = undefined;

    // Fetch detailed assessment data with questions
    this.internshipService.getInternshipAssessmentPreview(assessment.assessment_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedAssessment = response.data;

          // Process questions and answers properly
          if (this.selectedAssessment.answers && Array.isArray(this.selectedAssessment.answers)) {
            // Deduplicate questions based on question_id
            const uniqueAnswers = new Map();
            this.selectedAssessment.answers.forEach((answer: any) => {
              if (!uniqueAnswers.has(answer.question_id)) {
                // Parse options if they exist
                if (answer.options) {
                  try {
                    answer.optionsArr = typeof answer.options === 'string' ? JSON.parse(answer.options) : answer.options;
                  } catch (e) {
                    answer.optionsArr = [];
                  }
                }
                uniqueAnswers.set(answer.question_id, answer);
              }
            });
            this.selectedAssessment.answers = Array.from(uniqueAnswers.values());
          }

          // Handle resume URL
          const resumeUrl: string | null =
            this.selectedAssessment?.internship?.resume && typeof this.selectedAssessment.internship.resume === 'string'
              ? this.selectedAssessment.internship.resume
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
            this.selectedAssessment.internship.resume = fullResumeUrl;
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
    this.selectedAssessment = null;
    this.isLoadingPreview = false;
    this.safeResumeUrl = undefined;
  }

  // helper to get array of selected IDs
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
    // only consider visible page items for select-all
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

  // when approving single item or multiple items — open modal
  openApproveModal(modal: any, assessment?: any) {
    // if single assessment passed, set selection to that single item
    if (assessment) {
      this.selectedIds = new Set<string>([assessment.assessment_id]);
      // set default selectedStatus to current assessment status if available
      this.selectedStatus = assessment.status ? assessment.status as AssessmentStatus : AssessmentStatus.Passed;
      // PREFILL student status if available on the assessment (top-level or nested)
      this.selectedStudentStatus = assessment.studentstatus || assessment.internship?.studentstatus || 'free';
    } else {
      // keep existing selection (for multi-select) and default status
      this.selectedStatus = AssessmentStatus.Passed;
      this.selectedStudentStatus = 'free';
    }
    // default internship type fallback already set above
    this.modalRef = this.modalService.open(modal, {
      size: 'md',
      centered: true,
      backdrop: 'static'
    });
  }
  removeAssessment(assessmentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this internship assessment? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRemoving = true;
        this.internshipService.removeInternshipAssessment(assessmentId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Assessment removed successfully');
              this.loadAssessments();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to remove assessment');
            }
          },
          error: (err) => {
            this.toastr.error('Error removing assessment: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isRemoving = false;
          }
        });
      }
    });
  }
  // helper to show name in modal list
  getAssessmentNameById(id: string): string | null {
    const found = this.assessments.find(a => a.assessment_id === id) || this.paginateData.find(a => a.assessment_id === id);
    return found ? (found.internship?.name || found.internship?.firstname || null) : null;
  }

  // Approve / Change all selected IDs (now uses selectedStatus)
  approveSelected(modalRef?: NgbModalRef) {
    if (!this.hasSelection()) {
      this.toastr.error('No students selected');
      return;
    }
    const ids = this.selectionArray();
    this.isApproving = true;

    // build observables array calling new UpdateInternshipAssessmentStatus endpoint for each id
    // include selectedStudentStatus as `studentStatus`
    const observables = ids.map(id =>
      this.internshipService.updateInternshipAssessmentStatus(id, this.selectedStatus, this.selectedStudentStatus)
    );

    forkJoin(observables).subscribe({
      next: (results: any[]) => {
        this.toastr.success('Selected student(s) updated');
        // clear selection and refresh
        this.selectedIds.clear();
        this.loadAssessments();
        if (modalRef) {
          modalRef.close();
        }
      },
      error: (err) => {
        this.toastr.error('Error updating selected students: ' + (err.error?.message || err.message));
      }
    }).add(() => {
      this.isApproving = false;
    });
  }
  setCorrect(questionId: string, isCorrect: number) {
    if (!this.selectedAssessment) return;
    const internshipFormId = this.selectedAssessment.internship.id;
    const questionSetId = this.selectedAssessment.questionset.id;

    this.internshipService.updateInternshipAnswerCorrectness(internshipFormId, questionSetId, questionId, isCorrect).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Correctness updated');
          const answer = this.selectedAssessment.answers.find((a: any) => a.question_id === questionId);
          if (answer) {
            answer.is_correct = isCorrect;
          }
        } else {
          this.toastr.error(response.message || 'Failed to update');
        }
      },
      error: (err) => {
        this.toastr.error('Error updating correctness: ' + (err.error?.message || err.message));
      }
    });
  }

  downloadPdf() {
    if (this.filteredAssessments.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const today = new Date();
    const instituteName = this.filterCollege || 'All Institutes';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Internship Assessment Report', pageWidth / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Prepared for: ${instituteName}`, pageWidth / 2, 70, { align: 'center' });

    doc.addPage();

    // include Student Status
    const headers = ['#', 'Student Name', 'Email', 'College', 'Department', 'Subject', 'Status', 'Student Status', 'Total Marks', 'Obtained Marks'];
    const body = this.filteredAssessments.map((assessment, index) => [
      index + 1,
      assessment.internship?.name || 'N/A',
      assessment.internship?.email || 'N/A',
      assessment.internship?.collagename || 'N/A',
      assessment.internship?.department || 'N/A',
      assessment.internship?.subject || 'N/A',
      assessment.status ? assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1) : 'N/A',
      (assessment.studentstatus || assessment.internship?.studentstatus) ? String(assessment.studentstatus || assessment.internship?.studentstatus).charAt(0).toUpperCase() + String(assessment.studentstatus || assessment.internship?.studentstatus).slice(1) : 'N/A',
      assessment.total_marks || 'N/A',
      assessment.calculated_marks || '0'
    ]);

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 40,
      theme: 'grid'
    });

    doc.save(`internship-assessment-report-${this.getCurrentDateString()}.pdf`);
  }

  downloadExcel() {
    if (this.filteredAssessments.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const worksheetData: WorksheetRow[] = this.filteredAssessments.map((assessment, index) => ({
      '#': index + 1,
      'Student Name': assessment.internship?.name || 'N/A',
      'Email': assessment.internship?.email || 'N/A',
      'Mobile Number': assessment.internship?.mobilenumber || 'N/A',
      'College Name': assessment.internship?.collagename || 'N/A',
      'Department': assessment.internship?.department || 'N/A',
      'Subject': assessment.internship?.subject || 'N/A',
      'Status': assessment.status ? assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1) : 'N/A',
      'Student Status': (assessment.studentstatus || assessment.internship?.studentstatus) ? String(assessment.studentstatus || assessment.internship?.studentstatus).charAt(0).toUpperCase() + String(assessment.studentstatus || assessment.internship?.studentstatus).slice(1) : 'N/A',
      'Total Marks': assessment.total_marks || 0,
      'Obtained Marks': assessment.calculated_marks || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Internship Assessments');
    XLSX.writeFile(workbook, `internship-assessment-report-${this.getCurrentDateString()}.xlsx`);
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
}
