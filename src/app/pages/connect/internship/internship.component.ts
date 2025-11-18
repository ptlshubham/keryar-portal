import { Component, OnInit } from '@angular/core';
import { ConnectService } from 'src/app/core/services/connect.service';
import { InternshipService } from 'src/app/core/services/internship.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlacementService } from 'src/app/core/services/placement.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss']
})
export class InternshipComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  internshipFormDetails: any = [];
  selectedClient: any = null;
  collegeJobMappings: any[] = [];
  sendLinkForm: FormGroup;
  amountForm: FormGroup;
  selectedResumeUrl: string = '';
  safeResumeUrl: SafeResourceUrl = '';
  serverBaseUrl = 'https://api.fosterx.co';
  // Test link details fetched from API
  testLinkDetails: any[] = [];
  holdStudentDetails: any[] = [];
  activeTab = 1;
  sendLinkModalRef: NgbModalRef | null = null; // Reference for the send link modal
  searchText: string = '';
  filteredInternshipData: any[] = [];
  filteredTestLinkData: any[] = [];
  filteredHoldStudentData: any[] = [];
  selectedStudents: Set<number> = new Set();
  selectAll: boolean = false;
  isDeletingBulk = false;

  constructor(
    public connectService: ConnectService,
    public placementService: PlacementService,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private internshipService: InternshipService
  ) {
    this.sendLinkForm = this.fb.group({
      link_name: ['', Validators.required]
    });
    this.amountForm = this.fb.group({
      amount: ['', [Validators.min(0)]]  // Amount is now optional (no required validator)
    });
  }

  ngOnInit(): void {
    this.getInternshipDetails();
    this.getCollegeJobMappings();
    this.loadTestLinkDetails();
    this.loadHoldStudentDetails();
  }

  loadTestLinkDetails() {
    this.internshipService.getsendInternshipTestLinkDetails().subscribe({
      next: (res: any) => {
        // if API returns success wrapper, handle that
        if (res && res.success && Array.isArray(res.data)) {
          this.testLinkDetails = res.data;
        } else if (Array.isArray(res)) {
          this.testLinkDetails = res;
        } else if (res && Array.isArray(res.data)) {
          this.testLinkDetails = res.data;
        } else if (res) {
          // fallback: try to convert to array
          this.testLinkDetails = Array.isArray(res) ? res : [res];
        }
        this.filteredTestLinkData = [...this.testLinkDetails];
        this.applySearch();
      },
      error: (err) => {
        console.error('Error fetching test link details:', err);
        this.toastr.error('Failed to load test link details.', 'Error', { timeOut: 3000 });
      }
    });
  }


  applySearch() {
    const search = this.searchText.toLowerCase().trim();

    if (this.activeTab === 1) {
      if (!search) {
        this.filteredInternshipData = [...this.internshipFormDetails];
      } else {
        this.filteredInternshipData = this.internshipFormDetails.filter((item: any) => {
          return (
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
          );
        });
      }
      this.collectionSize = this.filteredInternshipData.length;
      this.page = 1; // Reset to first page
      this.getPagintaion();
    } else if (this.activeTab === 2) {
      if (!search) {
        this.filteredTestLinkData = [...this.testLinkDetails];
      } else {
        this.filteredTestLinkData = this.testLinkDetails.filter((item: any) => {
          return (
            (item.firstname && item.firstname.toLowerCase().includes(search)) ||
            (item.first_name && item.first_name.toLowerCase().includes(search)) ||
            (item.link_owner && item.link_owner.toLowerCase().includes(search)) ||
            (item.lastname && item.lastname.toLowerCase().includes(search)) ||
            (item.last_name && item.last_name.toLowerCase().includes(search)) ||
            (item.email && item.email.toLowerCase().includes(search)) ||
            (item.contact_email && item.contact_email.toLowerCase().includes(search)) ||
            (item.mobilenumber && item.mobilenumber.toString().includes(search)) ||
            (item.phone && item.phone.toString().includes(search)) ||
            (item.contact_number && item.contact_number.toString().includes(search)) ||
            (item.internshiptype && item.internshiptype.toLowerCase().includes(search)) ||
            (item.type && item.type.toLowerCase().includes(search)) ||
            (item.subject && item.subject.toLowerCase().includes(search)) ||
            (item.link_name && item.link_name.toLowerCase().includes(search)) ||
            (item.collagename && item.collagename.toLowerCase().includes(search)) ||
            (item.college_name && item.college_name.toLowerCase().includes(search)) ||
            (item.college && item.college.toLowerCase().includes(search)) ||
            (item.department && item.department.toLowerCase().includes(search)) ||
            (item.dept && item.dept.toLowerCase().includes(search))
          );
        });
      }
    } else if (this.activeTab === 3) {
      // clear selections when switching to Hold tab
      this.selectedStudents.clear();
      this.selectAll = false;
      if (!search) {
        this.filteredHoldStudentData = [...this.holdStudentDetails];
      } else {
        this.filteredHoldStudentData = this.holdStudentDetails.filter((item: any) => {
          return (
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
          );
        });
      }
      this.collectionSize = this.filteredHoldStudentData.length;
      this.page = 1;
      this.getPagintaion();
    }
  }

  loadHoldStudentDetails() {
    this.internshipService.getHoldInternship().subscribe({
      next: (res: any) => {
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

        this.holdStudentDetails = data || [];
        for (let i = 0; i < this.holdStudentDetails.length; i++) {
          this.holdStudentDetails[i].index = i + 1;
          if (this.holdStudentDetails[i].resume) {
            this.holdStudentDetails[i].resume_url = this.serverBaseUrl + this.holdStudentDetails[i].resume;
          }
        }

        this.filteredHoldStudentData = [...this.holdStudentDetails];
        if (this.activeTab === 3) {
          this.collectionSize = this.filteredHoldStudentData.length;
          this.page = 1;
          this.getPagintaion();
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load hold students.', 'Error');
      }
    });
  }

  clearSearch() {
    this.searchText = '';
    this.applySearch();
  }

  getPagintaion() {
    let dataSource: any[] = [];
    if (this.activeTab === 1) {
      dataSource = this.filteredInternshipData;
    } else if (this.activeTab === 2) {
      dataSource = this.filteredTestLinkData;
    } else if (this.activeTab === 3) {
      dataSource = this.filteredHoldStudentData;
    } else {
      dataSource = this.filteredInternshipData;
    }
    this.paginateData = dataSource
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openPreview(client: any, modalTpl: any) {
    this.selectedClient = client;
    this.modalService.open(modalTpl, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  openSendLinkModal(client: any, modalTpl: any) {
    this.selectedClient = client;
    this.sendLinkForm.reset();
    this.sendLinkModalRef = this.modalService.open(modalTpl, {
      size: 'md',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  sendLink(modal?: any) {
    if (this.sendLinkForm.invalid) {
      this.toastr.error('Please select a link.', 'Validation Error', { timeOut: 3000 });
      if (modal) {
        console.log('Closing modal: Validation Error');
        modal.close('Validation Error');
      }
      return;
    }

    const selectedLink = this.collegeJobMappings.find(mapping => mapping.link_name === this.sendLinkForm.value.link_name);
    if (!selectedLink) {
      this.toastr.error('Selected link not found.', 'Error', { timeOut: 3000 });
      if (modal) {
        console.log('Closing modal: Selected link not found');
        modal.close('Selected link not found');
      }
      return;
    }

    if (!this.selectedClient.email || !selectedLink.college_id) {
      this.toastr.error('Invalid data: Missing email or college ID.', 'Error', { timeOut: 3000 });
      if (modal) {
        console.log('Closing modal: Invalid data');
        modal.close('Invalid data');
      }
      return;
    }

    const linkData = {
      email: this.selectedClient.email,
      college_id: selectedLink.college_id,
      link_name: selectedLink.link_name
    };

    Swal.fire({
      title: 'Send Internship Link?',
      text: `Are you sure you want to send the link "${selectedLink.link_name}" to ${this.selectedClient.email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Close all open modals
        this.modalService.dismissAll();
        this.connectService.sendInternshipLink(linkData).subscribe({
          next: (res: any) => {
            if (res.success) {
              // Show success popup
              Swal.fire({
                icon: 'success',
                title: 'Link Sent!',
                text: res.message || 'Email sent successfully!',
                timer: 3000,
                showConfirmButton: false
              });
              // Show toastr after modals are closed
              setTimeout(() => {
                this.toastr.success(res.message || 'Email sent successfully!', 'Success', { timeOut: 3000 });
              }, 300);
              // Refresh data and update pagination, preserving current page
              if (this.activeTab === 1) {
                this.getInternshipDetails();
              } else if (this.activeTab === 2) {
                this.loadTestLinkDetails();
              } else if (this.activeTab === 3) {
                this.loadHoldStudentDetails();
              }
              // getInternshipDetails already calls getPagintaion, so no need to call it again
            } else {
              this.toastr.error(res.message || 'Failed to send email.', 'Error', { timeOut: 3000 });
            }
          },
          error: (err) => {
            console.error('Send Link API Error:', err);
            this.toastr.error(err.message || 'Network error while sending email.', 'Error', { timeOut: 3000 });
          }
        });
      } else {
        if (modal) {
          console.log('Closing modal: Cancelled by user');
          modal.close('Cancelled by user');
        }
      }
    });

  }

  removeClientsData(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this client entry? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.connectService.removeInternshipDetails(id).subscribe({
          next: (res: any) => {
            this.internshipFormDetails = res;
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Client details deleted successfully.',
              timer: 3000,
              showConfirmButton: false
            });
            if (this.activeTab === 1) {
              this.getInternshipDetails();
            } else if (this.activeTab === 2) {
              this.loadTestLinkDetails();
            } else if (this.activeTab === 3) {
              this.loadHoldStudentDetails();
            }
          },
          error: (err) => {
            console.error('Delete API Error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Failed to delete client details. Please try again.',
              timer: 3000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  getInternshipDetails() {
    this.connectService.getInternshipFormDetails().subscribe((res: any) => {
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
        // Single object returned — wrap in array
        data = [res];
      }

      this.internshipFormDetails = data || [];

      // Filter only students with autoapproved = 0 (manual approval) AND ishold = 0 or null (not on hold)
      this.internshipFormDetails = this.internshipFormDetails.filter(
        (student: any) => (student.autoapproved === 0 || !student.autoapproved) && (student.ishold === 0 || !student.ishold)
      );

      // Ensure indexes and resume URLs
      for (let i = 0; i < this.internshipFormDetails.length; i++) {
        this.internshipFormDetails[i].index = i + 1;
        // Construct full resume URL if resume path present
        if (this.internshipFormDetails[i].resume) {
          this.internshipFormDetails[i].resume_url = this.serverBaseUrl + this.internshipFormDetails[i].resume;
        }
      }

      this.filteredInternshipData = [...this.internshipFormDetails];
      this.collectionSize = this.filteredInternshipData.length;
      this.applySearch();
    });
  }

  getCollegeJobMappings() {
    this.placementService.getAllCollegeJobMappings().subscribe({
      next: (res: any) => {
        if (res.success) {
          // Filter mappings to only include those intended for internships.
          // Try common field names; fallback to checking link_name for the word 'internship'.
          const filtered = (res.data || []).filter((m: any) => {
            const typeFields = [m.link_type, m.type, m.link_for, m.jobtype];
            const hasType = typeFields.some(f => typeof f === 'string' && f.toLowerCase() === 'internship');
            const nameMatch = typeof m.link_name === 'string' && m.link_name.toLowerCase().includes('internship');
            return hasType || nameMatch;
          });

          this.collegeJobMappings = this.groupMappingsByCollege(filtered);
        } else {
          this.toastr.error(res.message || 'Failed to fetch college-job mappings.', 'Error', { timeOut: 3000 });
        }
      },
      error: (err) => {
        console.error('Get College Job Mappings Error:', err);
        this.toastr.error('Network error while fetching mappings.', 'Error', { timeOut: 3000 });
      }
    });
  }

  groupMappingsByCollege(mappings: any[]): any[] {
    const grouped = new Map<string, any>();
    mappings.forEach(mapping => {
      const key = `${mapping.college_id}|${mapping.link_name}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          college_id: mapping.college_id,
          college_name: mapping.college_name,
          link_name: mapping.link_name,
          jobtitles: [mapping.jobtitle],
          link_active: mapping.link_active,
          ids: [mapping.id]
        });
      } else {
        const existing = grouped.get(key)!;
        existing.jobtitles.push(mapping.jobtitle);
        existing.ids.push(mapping.id);
        existing.link_active = existing.link_active || mapping.link_active;
      }
    });

    return Array.from(grouped.values()).map(group => ({
      ...group,
      jobtitle: group.jobtitles.join(', ')
    }));
  }

  openResumeModal(client: any, modalTpl: any) {
    this.selectedClient = client;
    if (client.resume_url || client.resume) {
      this.selectedResumeUrl = client.resume_url || (this.serverBaseUrl + client.resume);
      this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedResumeUrl);
      this.modalService.open(modalTpl, {
        size: 'xl',
        backdrop: 'static',
        keyboard: true,
        centered: true
      });
    } else {
      this.toastr.error('No resume available for this candidate.', 'Error', { timeOut: 3000 });
    }
  }

  openResumeInNewTab(resumeUrl: string) {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      this.toastr.error('Resume URL not available.', 'Error', { timeOut: 3000 });
    }
  }

  downloadResume(client: any) {
    const fullResumeUrl = client.resume_url || (client.resume ? this.serverBaseUrl + client.resume : null);
    if (fullResumeUrl) {
      const link = document.createElement('a');
      link.href = fullResumeUrl;
      link.download = `${client.firstname}_${client.lastname}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.toastr.error('Resume not available for download.', 'Error', { timeOut: 3000 });
    }
  }

  downloadExcel() {
    const dataToExport = this.activeTab === 1 ? this.filteredInternshipData : this.filteredTestLinkData;

    if (!dataToExport || dataToExport.length === 0) {
      this.toastr.warning('No data available to download.', 'Warning', { timeOut: 3000 });
      return;
    }

    const exportData = dataToExport.map((item: any, index: any) => ({
      '#': index + 1,
      'Name': `${item.firstname || item.first_name || item.link_owner || ''}${item.lastname ? ' ' + (item.lastname || item.last_name || '') : ''}`.trim() || '-',
      'Email': item.email || item.contact_email || '-',
      'Created Date': item.createddate ? new Date(item.createddate).toLocaleDateString('en-GB') : '-',
      'Mobile Number': item.mobilenumber || item.phone || item.contact_number || '-',
      'College': item.collagename || item.college_name || item.college || item.institute || '-',
      'Start Date': item.startdate || '-',
      'End Date': item.enddate || '-',
      'Semester': item.semester || '-',
      'Status': item.status || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    const sheetName = this.activeTab === 1 ? 'Internship Forms' : 'Test Links';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = `${sheetName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    this.toastr.success('Excel file downloaded successfully!', 'Success', { timeOut: 3000 });
  }

  downloadPDF() {
    const dataToExport = this.activeTab === 1 ? this.filteredInternshipData : this.filteredTestLinkData;

    if (!dataToExport || dataToExport.length === 0) {
      this.toastr.warning('No data available to download.', 'Warning', { timeOut: 3000 });
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    const title = this.activeTab === 1 ? 'Internship Forms Data' : 'Test Links Data';

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const tableData = dataToExport.map((item: any, index: any) => [
      index + 1,
      `${item.firstname || item.first_name || item.link_owner || ''}${item.lastname ? ' ' + (item.lastname || item.last_name || '') : ''}`.trim() || '-',
      item.email || item.contact_email || '-',
      item.createddate ? new Date(item.createddate).toLocaleDateString('en-GB') : '-',
      item.mobilenumber || item.phone || item.contact_number || '-',
      item.collagename || item.college_name || item.college || item.institute || '-'
    ]);

    autoTable(doc, {
      head: [['#', 'Name', 'Created Date', 'Email', 'Mobile', 'College']],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202], textColor: 255 }
    });

    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    this.toastr.success('PDF file downloaded successfully!', 'Success', { timeOut: 3000 });
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
      this.paginateData.forEach((student: any) => {
        this.selectedStudents.add(student.id);
      });
    } else {
      this.selectedStudents.clear();
    }
  }

  isSelected(studentId: number): boolean {
    return this.selectedStudents.has(studentId);
  }

  openAmountModal(modalTpl: any) {
    if (this.selectedStudents.size === 0) {
      this.toastr.warning('Please select at least one student.', 'Warning', { timeOut: 3000 });
      return;
    }
    // Reset amount form (amount is now optional)
    this.amountForm.reset({ amount: '' });
    this.modalService.open(modalTpl, {
      size: 'md',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  bulkUpdateAutoApproved(status: boolean, modal?: any) {
    if (this.selectedStudents.size === 0) {
      this.toastr.warning('Please select at least one student.', 'Warning', { timeOut: 3000 });
      return;
    }

    if (this.amountForm.invalid) {
      this.toastr.error('Please enter a valid amount.', 'Validation Error', { timeOut: 3000 });
      return;
    }

    const amount = this.amountForm.value.amount;
    const statusText = status ? 'Auto-Approved' : 'Manual Approval';
    const selectedCount = this.selectedStudents.size;

    Swal.fire({
      title: 'Update Multiple Students?',
      text: `Are you sure you want to set ${selectedCount} student(s) to ${statusText} with amount ₹${amount}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update them!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (modal) {
          modal.close();
        }
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the students.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const updatePromises: any[] = [];
        const selectedIds = Array.from(this.selectedStudents);

        selectedIds.forEach(id => {
          const updateData: any = {
            id: id,
            autoapproved: status ? 1 : 0,
            amount: amount,
            ishold: 0  // Always set ishold to 0 when setting auto-approved
          };
          // If setting to Auto-Approved and the internship type is 'free', convert to 'paid'
          const student = this.internshipFormDetails.find((st: any) => st.id === id);
          if (status && student && student.internshiptype && String(student.internshiptype).toLowerCase() === 'free') {
            updateData['internshiptype'] = 'paid';
          }
          // If setting to Manual (status false) and internship type is not provided, keep as-is
          updatePromises.push(
            this.connectService.updateInternshipAutoApproved(updateData).toPromise()
          );
        });

        Promise.all(updatePromises)
          .then((responses: any[]) => {
            const successCount = responses.filter(res => res.success).length;
            const failCount = responses.length - successCount;

            // Re-fetch data from server to ensure latest state
            if (this.activeTab === 1) {
              this.getInternshipDetails();
            } else if (this.activeTab === 2) {
              this.loadTestLinkDetails();
            } else if (this.activeTab === 3) {
              this.loadHoldStudentDetails();
            }
            // also refresh hold students list (if any moved between tabs)
            this.loadHoldStudentDetails();

            // Clear selections
            this.selectedStudents.clear();
            this.selectAll = false;

            Swal.fire({
              icon: successCount > 0 ? 'success' : 'error',
              title: 'Bulk Update Complete',
              html: `<p><strong>${successCount}</strong> student(s) updated successfully.</p>
                     ${failCount > 0 ? `<p><strong>${failCount}</strong> student(s) failed to update.</p>` : ''}`,
              timer: 3000,
              showConfirmButton: false
            });

            if (successCount > 0) {
              this.toastr.success(`${successCount} student(s) updated successfully!`, 'Success', { timeOut: 3000 });
            }
            if (failCount > 0) {
              this.toastr.error(`${failCount} student(s) failed to update.`, 'Error', { timeOut: 3000 });
            }
          })
          .catch((err) => {
            console.error('Bulk Update Error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while updating students.',
              timer: 3000,
              showConfirmButton: false
            });
            this.toastr.error('Network error while updating students.', 'Error', { timeOut: 3000 });
          });
      }
    });
  }

  markStudentAsHold(studentId: number) {
    Swal.fire({
      title: 'Mark as Hold?',
      text: 'This student will be moved to Hold Students tab.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f1b44c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as hold!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updateData: any = {
          id: studentId,
          ishold: 1  // Set ishold to 1 to mark as hold
        };

        this.connectService.updateInternshipAutoApproved(updateData).subscribe({
          next: (res: any) => {
            this.toastr.success('Student marked as hold successfully!', 'Success');
            this.getInternshipDetails();  // Refresh the list
            this.loadHoldStudentDetails();  // Refresh hold students
          },
          error: (err) => {
            this.toastr.error('Failed to mark student as hold.', 'Error');
            console.error('Error marking student as hold:', err);
          }
        });
      }
    });
  }

  bulkDeleteStudents() {
    if (this.selectedStudents.size === 0) {
      this.toastr.warning('Please select at least one student.', 'Warning', { timeOut: 3000 });
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
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: res?.message || `${this.selectedStudents.size} student(s) deleted.`,
              timer: 3000,
              showConfirmButton: false
            });

            // Refresh lists depending on active tab
            if (this.activeTab === 1) {
              this.getInternshipDetails();
            }
            if (this.activeTab === 3) {
              this.loadHoldStudentDetails();
            }
            // Clear selections
            this.selectedStudents.clear();
            this.selectAll = false;
          },
          error: (err) => {
            console.error('Bulk delete error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Failed to delete selected students.',
              timer: 3000,
              showConfirmButton: false
            });
          }
        }).add(() => {
          this.isDeletingBulk = false;
        });
      }
    });
  }
}