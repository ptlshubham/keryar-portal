import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlacementService } from 'src/app/core/services/placement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  clientsData: any[] = [];
  paginateData: any[] = [];
  selectedForm: any = null;

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  validationForm!: FormGroup;
  submitted = false;

  // NEW: keep modal ref + safe PDF url
  private modalRef?: NgbModalRef;
  safeResumeUrl?: SafeResourceUrl;
  isLoadingPreview = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private placementService: PlacementService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Student List', active: true }
    ];

    this.validationForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.loadPlacementForms();
  }

  get f() { return this.validationForm.controls; }

  loadPlacementForms(): void {
    this.placementService.getAllPlacementForms().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientsData = response.data.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            name: `${item.firstname} ${item.lastname}`
          }));
          this.collectionSize = this.clientsData.length;
          this.getPagination();
        } else {
          this.toastr.error('Failed to load placement forms');
        }
      },
      error: (err) => {
        console.error('Error fetching placement forms:', err);
        this.toastr.error('Error fetching placement forms');
      }
    });
  }

  getPagination(): void {
    this.paginateData = this.clientsData.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  // UPDATED: use ng-bootstrap modal properly and prep the PDF URL
  openPreviewModal(content: any, formId: string): void {
    this.isLoadingPreview = true;
    this.selectedForm = null;
    this.safeResumeUrl = undefined;

    this.placementService.getPlacementFormById(formId).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedForm = response.data;

          // Build a safe URL for the PDF (works for absolute URLs or your served file path)
          const resumeUrl: string | null =
            this.selectedForm?.resume && typeof this.selectedForm.resume === 'string'
              ? this.selectedForm.resume
              : null;

          if (resumeUrl) {
            let fullResumeUrl: string;

            // Case 1: If backend already gives something like "/images/keryar/studentresume/xyz.pdf"
            if (resumeUrl.startsWith('/')) {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            }
            // Case 2: If backend only gives the filename
            else {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            }

            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullResumeUrl);
            this.selectedForm.resume = fullResumeUrl; // update for download/open
          }


          // Open modal (xl for more space, scrollable for long forms)
          this.modalRef = this.modalService.open(content, {
            size: 'xl',
            centered: true,
            scrollable: true,
            backdrop: 'static' // prevent accidental close
          });
        } else {
          this.toastr.error('Failed to fetch placement form details');
        }
      },
      error: (err) => {
        console.error('Error fetching placement form:', err);
        this.toastr.error('Error fetching placement form');
      }
    }).add(() => {
      this.isLoadingPreview = false;
    });
  }

  closeModal(): void {
    this.modalRef?.close();
    this.selectedForm = null;
    this.safeResumeUrl = undefined;
  }

  deletePlacementForm(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this placement form!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.placementService.removePlacementFormById(id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Deleted!', 'Placement form has been deleted.', 'success');
              this.clientsData = this.clientsData.filter((item) => item.id !== id);
              this.collectionSize = this.clientsData.length;
              this.getPagination();
            } else {
              Swal.fire('Failed!', 'Failed to delete placement form.', 'error');
            }
          },
          error: (err) => {
            console.error('Error deleting placement form:', err);
            Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
          }
        });
      }
    });
  }


  // Optional: better *ngFor performance
  trackById(_: number, item: any) { return item.id; }
}
