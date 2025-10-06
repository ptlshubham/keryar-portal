import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from 'src/app/core/services/career.service';
import { PlacementService } from 'src/app/core/services/placement.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-college-job-mapping',
  templateUrl: './college-job-mapping.component.html',
  styleUrls: ['./college-job-mapping.component.scss']
})
export class CollegeJobMappingComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  mappingForm!: FormGroup;
  colleges: any[] = [];
  jobOpenings: any[] = [];
  mappings: any[] = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any[] = [];
  serverPath: any = "http://localhost:4200/";

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private placementService: PlacementService,
    private careerService: CareerService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Manage College-Job Mappings', active: true }
    ];

    // Initialize form with jobopening_ids as an array
    this.mappingForm = this.fb.group({
      college_id: ['', Validators.required],
      jobopening_ids: [[], Validators.required], // Array for multiple job openings
      link_active: [true]
    });

    this.loadColleges();
    this.loadJobOpenings();
    this.loadMappings();
  }

  get f() { return this.mappingForm.controls; }

  loadColleges() {
    this.placementService.getAllColleges().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          this.colleges = res.filter((college: any) => college.isactive);
        } else {
          this.toastr.error('Failed to load colleges');
        }
      },
      error: (err) => {
        this.toastr.error('Error loading colleges: ' + (err.error?.message || err.message));
      }
    });
  }

  loadJobOpenings() {
    this.careerService.getAllJobOpenings().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          this.jobOpenings = res.filter((job: any) => job.isactive);
        } else {
          this.toastr.error('Failed to load job openings');
        }
      },
      error: (err) => {
        this.toastr.error('Error loading job openings: ' + (err.error?.message || err.message));
      }
    });
  }

  loadMappings() {
    this.placementService.getAllCollegeJobMappings().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.mappings = res.data;
          this.collectionSize = this.mappings.length;
          this.getPagination();
        } else {
          this.toastr.error(res.message || 'Failed to load mappings');
        }
      },
      error: (err) => {
        this.toastr.error('Error loading mappings: ' + (err.error?.message || err.message));
      }
    });
  }

  getPagination() {
    this.paginateData = this.mappings.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  submitMapping() {
    if (this.mappingForm.invalid) {
      this.mappingForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const mappingData = {
      college_id: this.mappingForm.value.college_id,
      jobopening_ids: this.mappingForm.value.jobopening_ids,
      link_active: this.mappingForm.value.link_active
    };

    this.placementService.saveCollegeJobMapping(mappingData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Mappings saved successfully');
          this.mappingForm.reset({ link_active: true, jobopening_ids: [] });
          this.loadMappings();
        } else {
          this.toastr.error(res.message || 'Failed to save mappings');
        }
      },
      error: (err) => {
        this.toastr.error('Error saving mappings: ' + (err.error?.message || err.message));
      }
    });
  }

  toggleLinkStatus(mapping: any, link_active: boolean) {
    const updateData = { id: mapping.id, link_active };
    this.placementService.updateCollegeJobLinkStatus(updateData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(`Link ${link_active ? 'activated' : 'deactivated'} successfully`);
          this.loadMappings();
        } else {
          this.toastr.error(res.message || 'Failed to update link status');
        }
      },
      error: (err) => {
        this.toastr.error('Error updating link status: ' + (err.error?.message || err.message));
      }
    });
  }

  deleteMapping(id: string) {
    this.placementService.deleteCollegeJobMapping(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Mapping deleted successfully');
          this.loadMappings();
        } else {
          this.toastr.error(res.message || 'Failed to delete mapping');
        }
      },
      error: (err) => {
        this.toastr.error('Error deleting mapping: ' + (err.error?.message || err.message));
      }
    });
  }

  getPlacementFormLink(collegeId: string): string {
    return `${this.serverPath}/placement/placement-form/${collegeId}`;
  }
}