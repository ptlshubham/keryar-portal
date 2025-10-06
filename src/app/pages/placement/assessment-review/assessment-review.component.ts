import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

enum AssessmentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

@Component({
  selector: 'app-assessment-review',
  templateUrl: './assessment-review.component.html',
  styleUrls: ['./assessment-review.component.scss']
})
export class AssessmentReviewComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  assessments: any[] = [];
  paginateData: any[] = [];
  selectedAssessment: any | null = null;
  filterStatus: string = '';
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  isLoadingPreview = false;
  isApproving = false;
  isRejecting = false;
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
            index: index + 1
          }));
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

    // Filter by search term (student name, email, or student ID)
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.student.name.toLowerCase().includes(searchLower) ||
        assessment.student.email.toLowerCase().includes(searchLower) ||
        assessment.student.studentid.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (this.startDate || this.endDate) {
      filteredAssessments = filteredAssessments.filter(assessment => {
        const assessmentDate = new Date(assessment.createddate).getTime();
        const start = this.startDate ? new Date(this.startDate).getTime() : null;
        const end = this.endDate ? new Date(this.endDate).getTime() : null;

        if (start && end) {
          return assessmentDate >= start && assessmentDate <= end;
        } else if (start) {
          return assessmentDate >= start;
        } else if (end) {
          return assessmentDate <= end;
        }
        return true;
      });
    }

    this.collectionSize = filteredAssessments.length;
    this.getPagination(filteredAssessments);
  }

  getPagination(filteredAssessments: any[] = this.assessments) {
    this.paginateData = filteredAssessments.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  filterByStatus(status: string) {
    this.filterStatus = status;
    this.page = 1;
    this.loadAssessments();
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  onDateChange() {
    this.page = 1;
    this.applyFilters();
  }

  openPreviewModal(modal: any, assessment: any) {
    this.isLoadingPreview = true;
    this.selectedAssessment = null;
    this.safeResumeUrl = undefined;

    this.placementService.getAssessmentPreview(assessment.assessment_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedAssessment = response.data;

          // Build a safe URL for the resume (works for absolute URLs or your served file path)
          const resumeUrl: string | null =
            this.selectedAssessment?.student?.resume && typeof this.selectedAssessment.student.resume === 'string'
              ? this.selectedAssessment.student.resume
              : null;

          if (resumeUrl) {
            let fullResumeUrl: string;

            // Case 1: If backend already gives something like "/images/keryar/studentresume/xyz.pdf"
            if (resumeUrl.startsWith('/')) {
              fullResumeUrl = `http://localhost:8300${resumeUrl}`;
            }
            // Case 2: If backend only gives the filename
            else {
              fullResumeUrl = `http://localhost:8300${resumeUrl}`;
            }

            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullResumeUrl);
            this.selectedAssessment.student.resume = fullResumeUrl; // update for download/open
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

  trackById(_: number, item: any) {
    return item.assessment_id;
  }
}