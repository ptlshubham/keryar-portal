// job-application-list.component.ts
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from 'src/app/core/services/career.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-application-list',
  templateUrl: './job-application-list.component.html',
  styleUrl: './job-application-list.component.scss'
})
export class JobApplicationListComponent implements OnInit {
  @ViewChild('previewModalTemplate', { static: false }) modalTemplate!: TemplateRef<any>;

  breadCrumbItems!: Array<{}>;
  serverPath: string = 'http://localhost:8300';
  applications: any[] = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any[] = [];

  selectedApp: any = null;
  resumeUrl: SafeResourceUrl | null = null;
  modalRef!: NgbModalRef;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private careerService: CareerService,
    private lightbox: Lightbox,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Career' },
      { label: 'Job Application List', active: true }
    ];
    this.loadApplications();
  }

  loadApplications() {
    this.careerService.getCareerApplications().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.applications = res.data.map((app: any, i: number) => ({
            ...app,
            index: i + 1
          }));
          this.collectionSize = this.applications.length;
          this.refreshPage();
        } else {
          this.toastr.error('Failed to load data');
        }
      },
      error: () => this.toastr.error('Network error')
    });
  }

  refreshPage() {
    const start = (this.page - 1) * this.pageSize;
    this.paginateData = this.applications.slice(start, start + this.pageSize);
  }

  openPreview(app: any) {
    this.selectedApp = app;
    this.resumeUrl = app.resume
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.serverPath + app.resume)
      : null;

    this.modalRef = this.modalService.open(this.modalTemplate, {
      size: 'xl',
      scrollable: true,
      centered: true
    });
  }

  downloadResume() {
    if (this.selectedApp?.resume) {
      window.open(this.serverPath + this.selectedApp.resume, '_blank');
    }
  }

  formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN') : '—';
  }

  formatTime(d: string | null): string {
    return d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';
  }
}