import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { CommonSevice } from 'src/app/core/services/common.service';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      const originalCount = (list || []).length;

      // Remove duplicates based on email addresses
      this.studentData = this.removeDuplicatesByEmail(list || []);
      const finalCount = this.studentData.length;
      const duplicatesRemoved = originalCount - finalCount;

      // Show notification if duplicates were automatically removed
      if (duplicatesRemoved > 0) {
        this.toastr.info(`${duplicatesRemoved} duplicate email(s) were automatically removed during data load.`, 'Duplicates Removed');
      }

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

  // Remove duplicate entries based on email addresses
  removeDuplicatesByEmail(data: any[]): any[] {
    const emailMap = new Map();
    const duplicatesRemoved: any[] = [];
    let duplicateCount = 0;

    data.forEach((student: any) => {
      const email = student.email?.toLowerCase().trim();
      
      if (!email) {
        // Keep entries without email
        duplicatesRemoved.push(student);
        return;
      }

      if (!emailMap.has(email)) {
        // First occurrence of this email - keep it
        emailMap.set(email, true);
        duplicatesRemoved.push(student);
      } else {
        // Duplicate email found - skip this entry
        duplicateCount++;
      }
    });

    return duplicatesRemoved;
  }

  // Manual duplicate removal method
  removeDuplicates() {
    const originalCount = this.studentData.length;
    
    // Find duplicates before removing them
    const duplicateInfo = this.findDuplicates();
    
    if (duplicateInfo.length === 0) {
      this.toastr.info('No duplicate emails found.', 'No Duplicates');
      return;
    }

    // Show confirmation with duplicate details
    const duplicateEmails = duplicateInfo.map(d => `${d.email} (${d.count} entries)`).join('\n');
    const confirmMessage = `Found ${duplicateInfo.length} duplicate email(s):\n\n${duplicateEmails}\n\nDo you want to remove duplicates? Only the first entry for each email will be kept.`;
    
    if (confirm(confirmMessage)) {
      this.studentData = this.removeDuplicatesByEmail(this.studentData);
      
      // Update indexes after removing duplicates
      for (let i = 0; i < this.studentData.length; i++) {
        this.studentData[i].index = i + 1;
      }

      // Recompute subjects and apply filters
      this.computeSubjects();
      this.applyFilter();

      const newCount = this.studentData.length;
      const removedCount = originalCount - newCount;
      
      this.toastr.success(`${removedCount} duplicate entries removed successfully.`, 'Cleanup Complete');
    }
  }

  // Find duplicate emails and their counts
  findDuplicates(): { email: string, count: number }[] {
    const emailCount = new Map<string, number>();
    
    this.studentData.forEach((student: any) => {
      const email = student.email?.toLowerCase().trim();
      if (email) {
        emailCount.set(email, (emailCount.get(email) || 0) + 1);
      }
    });

    const duplicates: { email: string, count: number }[] = [];
    emailCount.forEach((count, email) => {
      if (count > 1) {
        duplicates.push({ email, count });
      }
    });

    return duplicates;
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

  exportToExcel() {
    try {
      // Use filtered data for export (same data that user sees after search/filter)
      const dataToExport = this.filteredData.map((student, index) => ({
        'S.No': index + 1,
        'Subject': student.subject || '',
        'First Name': student.firstname || '',
        'Last Name': student.lastname || '',
        'Email': student.email || '',
        'Mobile Number': student.mobilenumber || '',
        'City': student.city || '',
        'College': student.collegename || '',
        'Department': student.department || ''
      }));

      if (dataToExport.length === 0) {
        this.toastr.warning('No data available to export.', 'Warning');
        return;
      }

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Set column widths for better formatting
      const columnWidths = [
        { wch: 8 },   // S.No
        { wch: 15 },  // Subject
        { wch: 15 },  // First Name
        { wch: 15 },  // Last Name
        { wch: 25 },  // Email
        { wch: 15 },  // Mobile Number
        { wch: 15 },  // City
        { wch: 25 },  // College
        { wch: 15 }   // Department
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student List');

      // Generate filename with current date
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `Student_List_${dateString}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);

      this.toastr.success(`Excel file downloaded successfully as ${filename}`, 'Export Successful');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.toastr.error('Failed to export data to Excel.', 'Export Error');
    }
  }

  exportToPDF() {
    try {
      // Use filtered data for export (same data that user sees after search/filter)
      if (this.filteredData.length === 0) {
        this.toastr.warning('No data available to export.', 'Warning');
        return;
      }

      // Create new PDF document
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation for better table fit

      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Student List Report', 14, 20);

      // Add export date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const exportDate = new Date().toLocaleDateString();
      doc.text(`Exported on: ${exportDate}`, 14, 28);

      // Add summary information
      doc.text(`Total Students: ${this.filteredData.length}`, 14, 35);
      if (this.selectedSubject) {
        doc.text(`Subject Filter: ${this.selectedSubject}`, 14, 42);
      }
      if (this.searchText) {
        doc.text(`Search Filter: ${this.searchText}`, 14, 49);
      }

      // Prepare table data
      const tableHeaders = [
        'S.No', 'Subject', 'Name', 'Email', 'Mobile', 'City', 'College', 'Department'
      ];

      const tableData = this.filteredData.map((student, index) => [
        (index + 1).toString(),
        student.subject || '',
        `${student.firstname || ''} ${student.lastname || ''}`.trim(),
        student.email || '',
        student.mobilenumber || '',
        student.city || '',
        student.collegename || '',
        student.department || ''
      ]);

      // Add table using autoTable
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: this.selectedSubject || this.searchText ? 56 : 49,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 128, 185], // Blue header
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 25 }, // Subject
          2: { cellWidth: 35 }, // Name
          3: { cellWidth: 45 }, // Email
          4: { cellWidth: 25 }, // Mobile
          5: { cellWidth: 25 }, // City
          6: { cellWidth: 40 }, // College
          7: { cellWidth: 25 }  // Department
        },
        margin: { top: 10, right: 14, bottom: 10, left: 14 },
        didDrawPage: (data) => {
          // Add page numbers
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.width - 30,
            doc.internal.pageSize.height - 10
          );
        }
      });

      // Generate filename with current date
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `Student_List_${dateString}.pdf`;

      // Save the PDF
      doc.save(filename);

      this.toastr.success(`PDF file downloaded successfully as ${filename}`, 'Export Successful');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      this.toastr.error('Failed to export data to PDF.', 'Export Error');
    }
  }
}

