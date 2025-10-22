import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InternshipService } from 'src/app/core/services/internship.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface WorksheetRow {
  '#': number;
  'Student Name': string;
  'Email': string;
  'Mobile Number': string;
  'College Name': string;
  'Department': string;
  'Duration': string;
  'Subject': string;
  'Total Marks': number;
  'Obtained Marks': number;
  'Remarks': string;
}

@Component({
  selector: 'app-approved-internship-students',
  templateUrl: './approved-internship-students.component.html',
  styleUrls: ['./approved-internship-students.component.scss']
})
export class ApprovedInternshipStudentsComponent implements OnInit {
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
    private internshipService: InternshipService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Approved Internship Students', active: true }
    ];
    this.loadApprovedStudents();
  }

  loadApprovedStudents() {
    this.internshipService.getApprovedInternshipStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data
            .filter((item: any) => item.interviewround === 'hired')
            .map((item: any, index: number) => ({
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
        student.internship.name.toLowerCase().includes(searchLower) ||
        student.internship.email.toLowerCase().includes(searchLower) ||
        student.internship.collagename.toLowerCase().includes(searchLower)
      );
    }

    if (this.filterCollege) {
      filteredStudents = filteredStudents.filter(student =>
        student.internship.collagename?.toLowerCase() === this.filterCollege.toLowerCase()
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
    doc.text('Approved Internship Students Report', pageWidth / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Prepared for: ${instituteName}`, pageWidth / 2, 70, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${today.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}`, pageWidth / 2, 90, { align: 'center' });

    doc.addPage();

    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Approved Internship Students Report', 14, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Institute: ${instituteName}`, 14, 28);
      doc.text(`Date: ${today.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}`, pageWidth - 14, 20, { align: 'right' });
    };

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

    const headers = ['#', 'Student Name', 'Email', 'College', 'Department', 'Subject', 'Duration', 'Total Marks', 'Obtained Marks'];
    const body = this.filteredStudents.map((student, index) => [
      index + 1,
      student.internship.name || 'N/A',
      student.internship.email || 'N/A',
      student.internship.collagename || 'N/A',
      student.internship.department || 'N/A',
      student.internship.subject || 'N/A',
      student.internship.duration || 'N/A',
      student.total_marks || 0,
      student.calculated_marks || 0
    ]);

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 35,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      didDrawPage: () => { addHeader(); }
    });

    addFooter();
    doc.save(`approved-internship-students-${this.getCurrentDateString()}.pdf`);
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
      'Duration': student.internship.duration || 'N/A',
      'Subject': student.internship.subject || 'N/A',
      'Total Marks': student.total_marks || 0,
      'Obtained Marks': student.calculated_marks || 0,
      'Remarks': student.remarks || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ApprovedInternshipStudents');
    XLSX.writeFile(workbook, `approved-internship-students-${this.getCurrentDateString()}.xlsx`);
  }

  private getCurrentDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  calculateQuestionMarks(student: any) {
    // ...existing code from internship-interview-round component...
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

  openPreviewModal(modal: any, student: any) {
    this.isLoadingPreview = true;
    this.selectedStudent = null;
    this.safeResumeUrl = undefined;

    this.internshipService.getInternshipAssessmentPreview(student.assessment_id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.selectedStudent = {
            ...student,
            ...response.data,
            answers: response.data.answers || [],
            calculated_marks: student.calculated_marks ?? response.data.obtained_marks ?? 0,
            total_marks: response.data.total_marks ?? student.total_marks ?? 0
          };

          this.calculateQuestionMarks(this.selectedStudent);

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
      },
      complete: () => {
        this.isLoadingPreview = false;
      }
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
