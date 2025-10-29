import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface WorksheetRow {
  '#': number;
  'Student Name': string;
  'Student ID': string;
  Email: string;
  'Applied Role': string;
  'Total Marks': number;
  'Obtained Marks': number;
  'Remarks': string;
}

@Component({
  selector: 'app-hired-students',
  templateUrl: './hired-students.component.html',
  styleUrls: ['./hired-students.component.scss']
})
export class HiredStudentsComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  students: any[] = [];
  paginateData: any[] = [];
  filteredStudents: any[] = [];
  selectedStudent: any | null = null;
  searchTerm: string = '';
  filterCollege: string = '';
  colleges: string[] = [];
  selectedDate: string = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  isLoadingPreview = false;
  isSavingRemarks = false;
  private modalRef?: NgbModalRef;
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
      { label: 'Hired Students', active: true }
    ];
    this.loadHiredStudents();
  }

  loadHiredStudents() {
    this.placementService.getApprovedStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data
            .filter((item: any) => item.interviewround === 'hired')
            .map((item: any, index: number) => ({
              ...item,
              index: index + 1,
              calculated_marks: item.obtained_marks ?? 0,
              total_marks: item.total_marks ?? 0,
              portfoliourl: item.portfoliourl || '',
              cover_letter: item.cover_letter || ''
            }));
          this.colleges = [...new Set(this.students.map(student => student.institute).filter(institute => institute))].sort();
          // Fetch detailed assessment data to calculate marks
          this.students.forEach(student => {
            this.placementService.getAssessmentPreview(student.id).subscribe({
              next: (previewResponse) => {
                if (previewResponse.success) {
                  student.answers = previewResponse.data.answers || [];
                  this.calculateQuestionMarks(student);
                }
              },
              error: (err) => {
                console.error('Error fetching preview for student:', student.id, err);
              }
            });
          });
          this.applyFilters();
        } else {
          this.toastr.error(response.message || 'Failed to fetch hired students');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching students: ' + (err.error?.message || err.message));
      }
    });
  }

  applyFilters() {
    let filteredStudents = [...this.students];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredStudents = filteredStudents.filter(student =>
        (student.firstname + ' ' + student.lastname).toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.studentid.toLowerCase().includes(searchLower)
      );
    }

    if (this.filterCollege) {
      filteredStudents = filteredStudents.filter(student =>
        student.institute?.toLowerCase() === this.filterCollege.toLowerCase()
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

    this.filteredStudents = filteredStudents;
    this.collectionSize = filteredStudents.length;
    this.getPagination();
  }

  getPagination() {
    this.paginateData = this.filteredStudents.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
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

  downloadPdf() {
    if (this.filteredStudents.length === 0) {
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
    doc.text('Hired Students Report', pageWidth / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Prepared for: ${instituteName}`, pageWidth / 2, 70, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${today.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}`, pageWidth / 2, 90, { align: 'center' });
    const filtersText = this.getFiltersText();
    doc.setFontSize(10);
    doc.text(filtersText, pageWidth / 2, 110, { align: 'center', maxWidth: pageWidth - 40 });

    doc.addPage();

    // Header on subsequent pages
    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Hired Students Report', 14, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Institute: ${instituteName}`, 14, 28);
      doc.text(`Date: ${today.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}`, pageWidth - 14, 20, { align: 'right' });
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

    addHeader();

    // Table data
    const headers = [
      '#',
      'Student Name',
      'Student ID',
      'Email',
      'Applied Role'
    ];

    const body = this.filteredStudents.map((student, index) => [
      index + 1,
      `${student.firstname} ${student.lastname}` || 'N/A',
      student.studentid || 'N/A',
      student.email || 'N/A',
      student.appliedrole || 'N/A'
    ]);

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 35,
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
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 60 },
        4: { cellWidth: 50 }
      },
      didDrawPage: () => {
        addHeader();
      }
    });

    addFooter();

    doc.save(`hired-students-report-${this.getCurrentDateString()}.pdf`);
  }

  downloadExcel() {
    if (this.filteredStudents.length === 0) {
      this.toastr.warning('No data available to download.');
      return;
    }

    const worksheetData: WorksheetRow[] = this.filteredStudents.map((student, index) => ({
      '#': index + 1,
      'Student Name': `${student.firstname} ${student.lastname}` || 'N/A',
      'Student ID': student.studentid || 'N/A',
      Email: student.email || 'N/A',
      'Applied Role': student.appliedrole || 'N/A',
      'Total Marks': student.total_marks || 0,
      'Obtained Marks': student.calculated_marks || 0,
      'Remarks': student.remarks || 'N/A'
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HiredStudents');

    const today = new Date();
    const summaryData = [
      { Field: 'Report Title', Value: 'Hired Students Report' },
      { Field: 'Institute', Value: this.filterCollege || 'All Institutes' },
      { Field: 'Generated On', Value: today.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) },
      { Field: 'Filters Applied', Value: this.getFiltersText() },
      { Field: 'Total Records', Value: this.filteredStudents.length }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    XLSX.writeFile(workbook, `hired-students-report-${this.getCurrentDateString()}.xlsx`);
  }

  private getFiltersText(): string {
    const filters: string[] = [];
    if (this.searchTerm) filters.push(`Search: ${this.searchTerm}`);
    if (this.filterCollege) filters.push(`Institute: ${this.filterCollege}`);
    if (this.selectedDate) filters.push(`Date: ${this.selectedDate}`);
    return filters.length > 0 ? `${filters.join(', ')}` : 'No filters applied';
  }

  private getCurrentDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
          const optionSum = answer.optionsArr
            .filter((opt: any, index: number) => this.isOptionSelected(answer.answer, index, opt.value))
            .reduce((sum: number, opt: any) => sum + Number(opt.value || 0), 0);
          const weight = Number(answer.weight || 0);
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

    student.calculated_marks = totalObtainedMarks;
  }

  openPreviewModal(modal: any, student: any) {
    this.isLoadingPreview = true;
    this.selectedStudent = null;
    this.safeResumeUrl = undefined;

    this.placementService.getAssessmentPreview(student.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.selectedStudent = {
            ...student,
            answers: response.data.answers || [],
            calculated_marks: student.calculated_marks ?? response.data.obtained_marks ?? 0,
            total_marks: response.data.total_marks ?? student.total_marks ?? 0,
            type: response.data.questionset?.type || student.type || 'N/A',
            difficulty: response.data.questionset?.difficulty || student.difficulty || 'N/A',
            year: response.data.questionset?.year || student.year || 'N/A',
            status: response.data.status || student.status || 'approved',
            remarks: response.data.remarks || student.remarks || 'N/A',
            resume: response.data.student?.resume || student.resume,
            portfoliourl: response.data.student?.portfoliourl || student.portfoliourl || '',
            cover_letter: response.data.student?.cover_letter || student.cover_letter || ''
          };

          this.calculateQuestionMarks(this.selectedStudent);

          const resumeUrl: string | null =
            this.selectedStudent?.resume && typeof this.selectedStudent.resume === 'string'
              ? this.selectedStudent.resume
              : null;

          if (resumeUrl) {
            let fullResumeUrl: string;
            if (resumeUrl.startsWith('/')) {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            } else {
              fullResumeUrl = resumeUrl;
            }
            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullResumeUrl);
            this.selectedStudent.resume = fullResumeUrl;
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
      },
      complete: () => {
        this.isLoadingPreview = false;
      }
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  closeModal() {
    this.modalRef?.close();
    this.selectedStudent = null;
    this.isLoadingPreview = false;
    this.safeResumeUrl = undefined;
  }

  saveRemarks() {
    if (!this.selectedStudent || !this.selectedStudent.id) {
      this.toastr.error('No student selected');
      return;
    }

    this.isSavingRemarks = true;
    this.placementService.updateRemarks(this.selectedStudent.id, this.selectedStudent.remarks).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message || 'Remarks saved successfully');
          this.loadHiredStudents();
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

  trackById(_: number, item: any) {
    return item.id;
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