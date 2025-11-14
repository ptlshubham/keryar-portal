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
import { forkJoin } from 'rxjs';

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
  selectedResumeUrl: string = '';
  safeResumeUrl: SafeResourceUrl = '';
  serverBaseUrl = 'https://api.fosterx.co';
  // Test link details fetched from API
  testLinkDetails: any[] = [];
  activeTab = 1;
  sendLinkModalRef: NgbModalRef | null = null; // Reference for the send link modal
  searchText: string = '';
  filteredInternshipData: any[] = [];
  filteredTestLinkData: any[] = [];
  sendingCertificateIds: Set<string> = new Set<string>();
  sendingOfferLetterIds: Set<string> = new Set<string>();
  selectedIds: Set<string> = new Set<string>();
  selectedDocumentType: 'certificate' | 'offerletter' = 'certificate';
  isSendingBulk = false;
  private bulkDocumentModalRef?: NgbModalRef;

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
  }

  ngOnInit(): void {
    this.getInternshipDetails();
    this.getCollegeJobMappings();
    this.loadTestLinkDetails();
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
    }
  }

  clearSearch() {
    this.searchText = '';
    this.applySearch();
  }

  getPagintaion() {
    const dataSource = this.activeTab === 1 ? this.filteredInternshipData : this.internshipFormDetails;
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
              this.getInternshipDetails();
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
            this.getInternshipDetails();
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
      'First Name': item.firstname || item.first_name || item.link_owner || '-',
      'Last Name': item.lastname || item.last_name || '-',
      'Internship Type': item.internshiptype || item.type || '-',
      'Email': item.email || item.contact_email || '-',
      'Mobile Number': item.mobilenumber || item.phone || item.contact_number || '-',
      'Subject': item.subject || item.link_name || '-',
      'College': item.collagename || item.college_name || item.college || item.institute || '-',
      'Department': item.department || item.dept || '-',
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
      item.firstname || item.first_name || item.link_owner || '-',
      item.lastname || item.last_name || '-',
      item.internshiptype || item.type || '-',
      item.email || item.contact_email || '-',
      item.mobilenumber || item.phone || item.contact_number || '-',
      item.subject || item.link_name || '-',
      item.collagename || item.college_name || item.college || item.institute || '-',
      item.department || item.dept || '-'
    ]);

    autoTable(doc, {
      head: [['#', 'First Name', 'Last Name', 'Type', 'Email', 'Mobile', 'Subject', 'College', 'Department']],
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

  // Send Certificate to individual student
  sendCertificate(internshipId: string) {
    Swal.fire({
      title: 'Send Certificate?',
      text: 'Are you sure you want to generate and send the completion certificate?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendingCertificateIds.add(internshipId);
        this.internshipService.generateAndSendCertificate(internshipId).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'Certificate Sent!',
                text: response.message || 'Certificate generated and sent successfully.',
                timer: 3000,
                showConfirmButton: false
              });
              this.getInternshipDetails();
            } else {
              this.toastr.error(response.message || 'Failed to send certificate.');
            }
          },
          error: (err) => {
            this.toastr.error('Error sending certificate: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.sendingCertificateIds.delete(internshipId);
          }
        });
      }
    });
  }

  // Send Offer Letter to individual student
  sendOfferLetter(internshipId: string) {
    Swal.fire({
      title: 'Send Offer Letter?',
      text: 'Are you sure you want to generate and send the offer letter?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendingOfferLetterIds.add(internshipId);
        this.internshipService.generateAndSendOfferLetter(internshipId).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'Offer Letter Sent!',
                text: response.message || 'Offer letter generated and sent successfully.',
                timer: 3000,
                showConfirmButton: false
              });
              this.getInternshipDetails();
            } else {
              this.toastr.error(response.message || 'Failed to send offer letter.');
            }
          },
          error: (err) => {
            this.toastr.error('Error sending offer letter: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.sendingOfferLetterIds.delete(internshipId);
          }
        });
      }
    });
  }

  isSendingCertificate(internshipId: string): boolean {
    return this.sendingCertificateIds.has(internshipId);
  }

  isSendingOfferLetter(internshipId: string): boolean {
    return this.sendingOfferLetterIds.has(internshipId);
  }

  // Selection methods
  toggleSelection(event: any, id: string) {
    if (event.target.checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  isAllSelected(): boolean {
    const visibleIds = this.paginateData.map((i: any) => i.id);
    return visibleIds.length > 0 && visibleIds.every((id: string) => this.selectedIds.has(id));
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visibleIds = this.paginateData.map((i: any) => i.id);
    if (checked) {
      visibleIds.forEach((id: string) => this.selectedIds.add(id));
    } else {
      visibleIds.forEach((id: string) => this.selectedIds.delete(id));
    }
  }

  hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  selectionArray(): string[] {
    return Array.from(this.selectedIds);
  }

  getStudentNameById(id: string): string | null {
    const found = this.internshipFormDetails.find((s: any) => s.id === id) ||
      this.paginateData.find((s: any) => s.id === id);
    return found ? `${found.firstname || ''} ${found.lastname || ''}`.trim() : null;
  }

  // Bulk document generation methods
  openBulkDocumentModal(modal: any) {
    if (!this.hasSelection()) {
      this.toastr.error('No students selected');
      return;
    }
    this.selectedDocumentType = 'certificate';
    this.bulkDocumentModalRef = this.modalService.open(modal, {
      size: 'md',
      centered: true,
      backdrop: 'static'
    });
  }

  sendBulkDocuments(modalRef?: NgbModalRef) {
    if (!this.hasSelection()) {
      this.toastr.error('No students selected');
      return;
    }

    const selectedInternshipIds = this.selectionArray();
    const documentTypeLabel = this.selectedDocumentType === 'certificate' ? 'Certificates' : 'Offer Letters';

    this.isSendingBulk = true;
    const apiCalls = selectedInternshipIds.map(id =>
      this.selectedDocumentType === 'certificate'
        ? this.internshipService.generateAndSendCertificate(id)
        : this.internshipService.generateAndSendOfferLetter(id)
    );

    forkJoin(apiCalls).subscribe({
      next: (results: any[]) => {
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        Swal.fire({
          title: `${documentTypeLabel} Sent!`,
          html: `<strong>${successCount}</strong> ${documentTypeLabel.toLowerCase()} sent successfully<br>` +
            (failCount > 0 ? `<span class="text-danger">${failCount} failed</span>` : ''),
          icon: successCount > 0 ? 'success' : 'error',
          confirmButtonColor: '#3085d6'
        });

        this.selectedIds.clear();
        this.getInternshipDetails();
        if (modalRef) {
          modalRef.close();
        }
      },
      error: (err) => {
        this.toastr.error('Error sending documents: ' + (err.error?.message || err.message));
      }
    }).add(() => {
      this.isSendingBulk = false;
    });
  }

  closeBulkDocumentModal() {
    this.bulkDocumentModalRef?.close();
  }
}