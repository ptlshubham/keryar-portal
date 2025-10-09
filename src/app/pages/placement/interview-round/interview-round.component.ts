import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

enum InterviewStatus {
  Pending = 'pending',
  Hired = 'hired',
  Rejected = 'rejected'
}

interface WorksheetRow {
  '#': number;
  'Student Name': string;
  'Student ID': string;
  Email: string;
  'Applied Role': string;
  'Interview Status': string;
  'Total Marks': number;
  'Obtained Marks': number;
  'Remarks': string;
}

@Component({
  selector: 'app-interview-round',
  templateUrl: './interview-round.component.html',
  styleUrls: ['./interview-round.component.scss']
})
export class InterviewRoundComponent implements OnInit {
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
  interviewStatus = InterviewStatus;
  safeResumeUrl?: SafeResourceUrl;
  safePortfolioImages: { [key: string]: SafeResourceUrl } = {};

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private placementService: PlacementService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Interview Round', active: true }
    ];
    this.loadApprovedStudents();
  }

  loadApprovedStudents() {
    this.placementService.getApprovedStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            obtained_marks: item.obtained_marks ?? 0,
            total_marks: item.total_marks ?? 0
          }));
          this.colleges = [...new Set(this.students.map(student => student.institute).filter(institute => institute))].sort();
          this.applyFilters();
        } else {
          this.toastr.error(response.message || 'Failed to fetch approved students');
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
        student.institute.toLowerCase() === this.filterCollege.toLowerCase()
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
        student.interviewround === this.filterStatus
      );
    }

    this.filteredStudents = filteredStudents;
    this.collectionSize = filteredStudents.length;
    this.getPagination(filteredStudents);
  }

  getPagination(filteredStudents: any[] = this.filteredStudents) {
    this.paginateData = filteredStudents.slice(
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
    doc.text('Interview Round Report', pageWidth / 2, 50, { align: 'center' });
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
      doc.text('Interview Round Report', 14, 20);
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
      'Applied Role',
      'Total Marks',
      'Obtained Marks',
      'Interview Status',
      'Remarks'
    ];

    const body = this.filteredStudents.map((student, index) => [
      index + 1,
      `${student.firstname} ${student.lastname}` || 'N/A',
      student.studentid || 'N/A',
      student.email || 'N/A',
      student.appliedrole || 'N/A',
      student.total_marks || 0,
      student.obtained_marks || 0,
      student.interviewround ? student.interviewround.charAt(0).toUpperCase() + student.interviewround.slice(1) : 'Pending',
      student.remarks || 'N/A'
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
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 40 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
        8: { cellWidth: 40 }
      },
      didDrawPage: () => {
        addHeader();
      }
    });

    addFooter();

    doc.save(`interview-round-report-${this.getCurrentDateString()}.pdf`);
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
      'Interview Status': student.interviewround ? student.interviewround.charAt(0).toUpperCase() + student.interviewround.slice(1) : 'Pending',
      'Total Marks': student.total_marks || 0,
      'Obtained Marks': student.obtained_marks || 0,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'InterviewRound');

    const today = new Date();
    const summaryData = [
      { Field: 'Report Title', Value: 'Interview Round Report' },
      { Field: 'Institute', Value: this.filterCollege || 'All Institutes' },
      { Field: 'Generated On', Value: today.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) },
      { Field: 'Filters Applied', Value: this.getFiltersText() },
      { Field: 'Total Records', Value: this.filteredStudents.length }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    XLSX.writeFile(workbook, `interview-round-report-${this.getCurrentDateString()}.xlsx`);
  }

  private getFiltersText(): string {
    const filters: string[] = [];
    if (this.searchTerm) filters.push(`Search: ${this.searchTerm}`);
    if (this.filterCollege) filters.push(`Institute: ${this.filterCollege}`);
    if (this.selectedDate) filters.push(`Date: ${this.selectedDate}`);
    if (this.filterStatus) filters.push(`Interview Status: ${this.filterStatus.charAt(0).toUpperCase() + this.filterStatus.slice(1)}`);
    return filters.length > 0 ? `${filters.join(', ')}` : 'No filters applied';
  }

  private getCurrentDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  openPreviewModal(modal: any, student: any) {
    this.isLoadingPreview = true;
    this.selectedStudent = null;
    this.safeResumeUrl = undefined;
    this.safePortfolioImages = {};

    this.placementService.getAssessmentPreview(student.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedStudent = {
            ...student,
            ...response.data, // Merge API response with existing student data
            cover_letter: response.data.cover_letter || student.cover_letter || '', // Ensure cover_letter is included
            portfoliourl: response.data.portfoliourl || student.portfoliourl || '', // Ensure portfoliourl is included
            portfolios: response.data.portfolios || [], // Ensure portfolios is included
            answers: response.data.answers || [],
            obtained_marks: response.data.obtained_marks ?? student.obtained_marks ?? 0,
            total_marks: response.data.total_marks ?? student.total_marks ?? 0
          };

          // Sanitize resume URL
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

          // Sanitize portfolio image URLs
          if (this.selectedStudent?.portfolios?.length) {
            this.selectedStudent.portfolios.forEach((portfolio: any) => {
              if (portfolio.coverimage) {
                const fullImageUrl = portfolio.coverimage.startsWith('/')
                  ? `https://api.fosterx.co${portfolio.coverimage}`
                  : portfolio.coverimage;
                this.safePortfolioImages[portfolio.id] = this.sanitizer.bypassSecurityTrustResourceUrl(fullImageUrl);
              }
            });
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

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  closeModal() {
    this.modalRef?.close();
    this.selectedStudent = null;
    this.isLoadingPreview = false;
    this.safeResumeUrl = undefined;
    this.safePortfolioImages = {};
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
          this.loadApprovedStudents(); // Reload to update table
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
      text: 'Do you want to mark this student as hired?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, hire them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isHiring = true;
        this.placementService.updateInterviewStatus({ id: studentId, interviewround: InterviewStatus.Hired }).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student marked as hired');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to mark as hired');
            }
          },
          error: (err) => {
            this.toastr.error('Error marking as hired: ' + (err.error?.message || err.message));
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
      text: 'Do you want to reject this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRejecting = true;
        this.placementService.updateInterviewStatus({ id: studentId, interviewround: InterviewStatus.Rejected }).subscribe({
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
        this.placementService.removeInterviewStudent(studentId).subscribe({
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

  trackById(_: number, item: any) {
    return item.id;
  }
}