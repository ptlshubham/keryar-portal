import { Component, OnInit } from '@angular/core';
import { ConnectService } from 'src/app/core/services/connect.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlacementService } from 'src/app/core/services/placement.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  constructor(
    public connectService: ConnectService,
    public placementService: PlacementService,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.sendLinkForm = this.fb.group({
      link_name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInternshipDetails();
    this.getCollegeJobMappings();
  }

  getPagintaion() {
    this.paginateData = this.internshipFormDetails
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
    this.modalService.open(modalTpl, {
      size: 'md',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  sendLink() {
    if (this.sendLinkForm.invalid) {
      this.toastr.error('Please select a link.', 'Validation Error', { timeOut: 3000 });
      return;
    }

    const selectedLink = this.collegeJobMappings.find(mapping => mapping.link_name === this.sendLinkForm.value.link_name);
    if (!selectedLink) {
      this.toastr.error('Selected link not found.', 'Error', { timeOut: 3000 });
      return;
    }

    if (!this.selectedClient.email || !selectedLink.college_id) {
      this.toastr.error('Invalid data: Missing email or college ID.', 'Error', { timeOut: 3000 });
      return;
    }

    const linkData = {
      email: this.selectedClient.email,
      college_id: selectedLink.college_id, // Use college_id from collegeJobMappings
      link_name: selectedLink.link_name
    };


    this.connectService.sendInternshipLink(linkData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Email sent successfully!', 'Success', { timeOut: 3000 });
          this.modalService.dismissAll();
        } else {
          this.toastr.error(res.message || 'Failed to send email.', 'Error', { timeOut: 3000 });
        }
      },
      error: (err) => {
        console.error('Send Link API Error:', err); // Detailed error logging
        this.toastr.error(err.message || 'Network error while sending email.', 'Error', { timeOut: 3000 });
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
      this.internshipFormDetails = res;
      debugger
      console.log(res)
      for (let i = 0; i < this.internshipFormDetails.length; i++) {
        this.internshipFormDetails[i].index = i + 1;
        // Construct full resume URL
        if (this.internshipFormDetails[i].resume) {
          this.internshipFormDetails[i].resume_url = this.serverBaseUrl + this.internshipFormDetails[i].resume;
        }
      }
      this.collectionSize = this.internshipFormDetails.length;
      this.getPagintaion();
    });
  }

  getCollegeJobMappings() {
    this.placementService.getAllCollegeJobMappings().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.collegeJobMappings = this.groupMappingsByCollege(res.data);
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
}