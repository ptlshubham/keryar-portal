import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

enum AssessmentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

interface WorksheetRow {
  '#': number;
  'Student Name': string;
  'Student ID': string;
  Email: string;
  'Applied Role': string;
  Status: string;
  'Total Marks': number;
  'Obtained Marks': number;
}

@Component({
  selector: 'app-assessment-review',
  standalone: false,
  templateUrl: './assessment-review.component.html',
  styleUrls: ['./assessment-review.component.scss']
})
export class AssessmentReviewComponent implements OnInit {
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

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private placementService: PlacementService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Assessment Review', active: true }
    ];
    this.loadAssessments();
  }

  loadAssessments() {
    this.placementService.getAllStudentAssessments(this.filterStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.assessments = response.data.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            calculated_marks: 0 // Initialize calculated marks
          }));
          this.colleges = [...new Set(this.assessments.map(assessment => assessment.student.institute).filter(institute => institute))].sort();

          // Fetch marks for each assessment
          this.loadAssessmentMarks();

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

  private loadAssessmentMarks() {
    this.assessments.forEach(assessment => {
      this.placementService.getAssessmentPreview(assessment.assessment_id).subscribe({
        next: (previewResponse) => {
          if (previewResponse.success && previewResponse.data.answers) {
            // Deduplicate questions based on question_id
            const uniqueAnswers = new Map();
            previewResponse.data.answers.forEach((answer: any) => {
              if (!uniqueAnswers.has(answer.question_id)) {
                uniqueAnswers.set(answer.question_id, answer);
              }
            });
            const deduplicatedAnswers = Array.from(uniqueAnswers.values());

            // Calculate marks for this assessment
            const calculatedMarks = this.calculateMarksForAnswers(deduplicatedAnswers);
            assessment.calculated_marks = calculatedMarks;

            // Update the filtered assessments and pagination if needed
            this.applyFilters();
          }
        },
        error: (err) => {
          console.error('Error fetching marks for assessment:', assessment.assessment_id, err);
          assessment.calculated_marks = 0;
        }
      });
    });
  }

  private calculateMarksForAnswers(answers: any[]): number {
    if (!answers || !Array.isArray(answers)) {
      return 0;
    }

    let totalObtainedMarks = 0;

    answers.forEach((answer: any) => {
      let questionMarks = 0;

      if (answer.option_type === 'Checkbox') {
        if (Array.isArray(answer.answer)) {
          const optionSum = answer.optionsArr
            .filter((opt: any, index: number) => this.isOptionSelected(answer.answer, index, opt.value))
            .reduce((sum: number, opt: any) => sum + Number(opt.value || 0), 0);
          const weight = Number(answer.weight || 0);
          // Cap the checkbox score to the question weight if weight is provided
          questionMarks = weight > 0 ? Math.min(optionSum, weight) : optionSum;
        }
      } else if (answer.option_type === 'Radio') {
        const selectedOption = answer.optionsArr.find((opt: any, index: number) =>
          this.isRadioSelected(answer.answer, index, opt.value)
        );
        questionMarks = selectedOption ? Number(selectedOption.value || 0) : 0;
      } else if (answer.option_type === 'Input' || answer.option_type === 'Textarea') {
        questionMarks = answer.is_correct === 1 ? Number(answer.weight || 0) : 0;
      }

      totalObtainedMarks += questionMarks;
    });

    return totalObtainedMarks;
  }

  applyFilters() {
    let filteredAssessments = [...this.assessments];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.student.name.toLowerCase().includes(searchLower) ||
        assessment.student.email.toLowerCase().includes(searchLower) ||
        assessment.student.studentid.toLowerCase().includes(searchLower)
      );
    }

    if (this.filterCollege) {
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.student.institute.toLowerCase() === this.filterCollege.toLowerCase()
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
            aValue = a.student.name?.toLowerCase() || '';
            bValue = b.student.name?.toLowerCase() || '';
            break;
          case 'studentid':
            aValue = a.student.studentid?.toLowerCase() || '';
            bValue = b.student.studentid?.toLowerCase() || '';
            break;
          case 'email':
            aValue = a.student.email?.toLowerCase() || '';
            bValue = b.student.email?.toLowerCase() || '';
            break;
          case 'college':
            aValue = a.student.institute?.toLowerCase() || '';
            bValue = b.student.institute?.toLowerCase() || '';
            break;
          case 'role':
            aValue = a.student.appliedrole?.toLowerCase() || '';
            bValue = b.student.appliedrole?.toLowerCase() || '';
            break;
          case 'questionset':
            aValue = a.questionset.type?.toLowerCase() || '';
            bValue = b.questionset.type?.toLowerCase() || '';
            break;
          case 'difficulty':
            const difficultyOrder: { [key: string]: number } = { 'easy': 1, 'medium': 2, 'hard': 3 };
            aValue = difficultyOrder[a.questionset.difficulty?.toLowerCase()] || 0;
            bValue = difficultyOrder[b.questionset.difficulty?.toLowerCase()] || 0;
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

  downloadPdf() {
    if (this.filteredAssessments.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const today = new Date();
    const instituteName = this.filterCollege || 'All Institutes';

    // Cover Page
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Student Assessment Report', pageWidth / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Prepared for: ${instituteName}`, pageWidth / 2, 70, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${today.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}`, pageWidth / 2, 90, { align: 'center' });
    const filtersText = this.getFiltersText();
    doc.setFontSize(10);
    doc.text(filtersText, pageWidth / 2, 110, { align: 'center', maxWidth: pageWidth - 40 });

    doc.addPage();

    // First page header (main header)
    const addFirstPageHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Student Assessment Report', 14, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Institute: ${instituteName}`, 14, 30);
      doc.text(`Date: ${today.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}`, pageWidth - 14, 20, { align: 'right' });
    };

    // Subsequent pages header (simple header)
    const addSubsequentPageHeader = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Date: ${today.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}`, pageWidth - 14, 15, { align: 'right' });
    };

    // Footer with page number
    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`Page ${i - 1} of ${pageCount - 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    };

    // Add first page header
    addFirstPageHeader();

    // Table data
    const headers = [
      '#',
      'Student Name',
      'Student ID',
      'Email',
      'Applied Role',
      'Total Marks',
      'Obtained Marks',
      'Status'
    ];

    const body = this.filteredAssessments.map((assessment, index) => [
      index + 1,
      assessment.student.name || 'N/A',
      assessment.student.studentid || 'N/A',
      assessment.student.email || 'N/A',
      assessment.student.appliedrole || 'N/A',
      assessment.total_marks || 'N/A',
      assessment.calculated_marks || '0',
      assessment.status ? assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1) : 'N/A'
    ]);

    let isFirstTablePage = true;

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 40,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        minCellHeight: 8
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 40 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 }
      },
      didDrawPage: (data) => {
        if (!isFirstTablePage) {
          addSubsequentPageHeader();
        }
        isFirstTablePage = false;
      }
    });

    addFooter();

    doc.save(`assessment-report-${this.getCurrentDateString()}.pdf`);
  }

  downloadExcel() {
    if (this.filteredAssessments.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const worksheetData: WorksheetRow[] = this.filteredAssessments.map((assessment, index) => ({
      '#': index + 1,
      'Student Name': assessment.student.name || 'N/A',
      'Student ID': assessment.student.studentid || 'N/A',
      Email: assessment.student.email || 'N/A',
      'Applied Role': assessment.student.appliedrole || 'N/A',
      Status: assessment.status ? assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1) : 'N/A',
      'Total Marks': assessment.total_marks || 'N/A',
      'Obtained Marks': assessment.calculated_marks || '0'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const headerStyle = { font: { bold: true } };
    XLSX.utils.sheet_add_aoa(worksheet, [Object.keys(worksheetData[0])], { origin: 'A1' });
    worksheet['!rows'] = [{ hpt: 20 }];
    for (let col in worksheet) {
      if (col[0] === '!' || parseInt(col.slice(1)) !== 1) continue;
      worksheet[col].s = headerStyle;
    }

    const colWidths = Object.keys(worksheetData[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...(worksheetData.map(row => String(row[key as keyof WorksheetRow]).length))
      ) + 2
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessments');

    const today = new Date();
    const summaryData = [
      { Field: 'Report Title', Value: 'Student Assessment Report' },
      { Field: 'Institute', Value: this.filterCollege || 'All Institutes' },
      { Field: 'Generated On', Value: today.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) },
      { Field: 'Filters Applied', Value: this.getFiltersText() },
      { Field: 'Total Records', Value: this.filteredAssessments.length }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    XLSX.writeFile(workbook, `assessment-report-${this.getCurrentDateString()}.xlsx`);
  }

  private getFiltersText(): string {
    const filters: string[] = [];
    if (this.searchTerm) filters.push(`Search: ${this.searchTerm}`);
    if (this.filterCollege) filters.push(`Institute: ${this.filterCollege}`);
    if (this.selectedDate) filters.push(`Date: ${this.selectedDate}`);
    if (this.filterStatus) filters.push(`Status: ${this.filterStatus}`);
    if (this.sortColumn) filters.push(`Sorted by: ${this.sortColumn} (${this.sortDirection})`);
    return filters.length > 0 ? `${filters.join(', ')}` : 'No filters applied';
  }

  private getCurrentDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  openPreviewModal(modal: any, assessment: any) {
    this.isLoadingPreview = true;
    this.selectedAssessment = null;
    this.safeResumeUrl = undefined;

    this.placementService.getAssessmentPreview(assessment.assessment_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedAssessment = response.data;

          // Deduplicate questions based on question_id
          if (this.selectedAssessment.answers && Array.isArray(this.selectedAssessment.answers)) {
            const uniqueAnswers = new Map();
            this.selectedAssessment.answers.forEach((answer: any) => {
              if (!uniqueAnswers.has(answer.question_id)) {
                uniqueAnswers.set(answer.question_id, answer);
              }
            });
            this.selectedAssessment.answers = Array.from(uniqueAnswers.values());
          }

          this.calculateQuestionMarks(this.selectedAssessment);

          const resumeUrl: string | null =
            this.selectedAssessment?.student?.resume && typeof this.selectedAssessment.student.resume === 'string'
              ? this.selectedAssessment.student.resume
              : null;

          if (resumeUrl) {
            let fullResumeUrl: string;
            if (resumeUrl.startsWith('/')) {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            } else {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            }

            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullResumeUrl);
            this.selectedAssessment.student.resume = fullResumeUrl;
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

  approveAssessment(assessmentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this assessment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isApproving = true;
        this.placementService.approveRejectAssessment(assessmentId, AssessmentStatus.Approved).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Assessment approved');
              this.loadAssessments();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to approve assessment');
            }
          },
          error: (err) => {
            this.toastr.error('Error approving assessment: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isApproving = false;
          }
        });
      }
    });
  }

  rejectAssessment(assessmentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this assessment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRejecting = true;
        this.placementService.approveRejectAssessment(assessmentId, AssessmentStatus.Rejected).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Assessment rejected');
              this.loadAssessments();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to reject assessment');
            }
          },
          error: (err) => {
            this.toastr.error('Error rejecting assessment: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isRejecting = false;
          }
        });
      }
    });
  }

  removeAssessment(assessmentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this assessment? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRemoving = true;
        this.placementService.removePlacementFormById(assessmentId).subscribe({
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

  calculateQuestionMarks(assessment: any) {
    if (!assessment || !assessment.answers) {
      assessment.calculated_marks = 0;
      return;
    }

    let totalObtainedMarks = 0;

    assessment.answers = assessment.answers.map((answer: any) => {
      let questionMarks = 0;

      if (answer.option_type === 'Checkbox') {
        if (Array.isArray(answer.answer)) {
          const optionSum = answer.optionsArr
            .filter((opt: any, index: number) => this.isOptionSelected(answer.answer, index, opt.value))
            .reduce((sum: number, opt: any) => sum + Number(opt.value || 0), 0);
          const weight = Number(answer.weight || 0);
          // Cap the checkbox score to the question weight if weight is provided
          questionMarks = weight > 0 ? Math.min(optionSum, weight) : optionSum;
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

    assessment.calculated_marks = totalObtainedMarks;
  }

  setCorrect(questionId: string, isCorrect: number) {
    if (!this.selectedAssessment) return;
    const pfId = this.selectedAssessment.student.id;
    const qsId = this.selectedAssessment.questionset.id;
    this.placementService.updateAnswerCorrectness(pfId, qsId, questionId, isCorrect).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Correctness updated');
          const answer = this.selectedAssessment.answers.find((a: any) => a.question_id === questionId);
          if (answer) {
            answer.is_correct = isCorrect;
            this.calculateQuestionMarks(this.selectedAssessment);

            // Update the marks in the main assessments list as well
            const mainAssessment = this.assessments.find(a => a.assessment_id === this.selectedAssessment.assessment_id);
            if (mainAssessment) {
              mainAssessment.calculated_marks = this.selectedAssessment.calculated_marks;
              this.applyFilters(); // Refresh the display
            }
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

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
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