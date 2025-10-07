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
  groupedMappings: any[] = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any[] = [];
  serverPath: string = "http://localhost:4500/";
  addingCollege = false; // Track college addition state

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

    // Initialize mapping form
    this.mappingForm = this.fb.group({
      college_id: ['', Validators.required],
      jobopening_ids: [[], Validators.required],
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
          this.groupedMappings = this.groupMappingsByCollege(this.mappings);
          this.collectionSize = this.groupedMappings.length;
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

  groupMappingsByCollege(mappings: any[]): any[] {
    const grouped = new Map<string, any>();
    mappings.forEach(mapping => {
      const collegeId = mapping.college_id;
      if (!grouped.has(collegeId)) {
        grouped.set(collegeId, {
          college_id: mapping.college_id,
          college_name: mapping.college_name,
          jobtitles: [mapping.jobtitle],
          link_active: mapping.link_active,
          ids: [mapping.id]
        });
      } else {
        const existing = grouped.get(collegeId)!;
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

  getPagination() {
    this.paginateData = this.groupedMappings.slice(
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

  addNewCollege = (term: string): Promise<any> => {
    this.addingCollege = true; // Show loading spinner
    const newCollege = { name: term, isactive: true };
    return new Promise((resolve, reject) => {
      this.placementService.saveCollegeDetails(newCollege).subscribe({
        next: (res: any) => {
          this.addingCollege = false;
          if (res.success && res.data && res.data.id) {
            this.toastr.success(`College "${term}" added successfully`);
            this.colleges = [...this.colleges, res.data]; // Update colleges list
            this.mappingForm.patchValue({ college_id: res.data.id }); // Set new college ID
            resolve(res.data); // Resolve with the new college object
          } else {
            this.toastr.error(res.message || 'Failed to add college');
            reject(new Error(res.message || 'Failed to add college'));
          }
        },
        error: (err) => {
          this.addingCollege = false;
          this.toastr.error('Error adding college: ' + (err.error?.message || err.message));
          reject(err);
        }
      });
    });
  }

  toggleLinkStatus(mapping: any, link_active: boolean) {
    const updateData = mapping.ids.map((id: string) => ({ id, link_active }));
    Promise.all(
      updateData.map((data: any) =>
        this.placementService.updateCollegeJobLinkStatus(data).toPromise()
      )
    ).then(results => {
      const allSuccess = results.every((res: any) => res.success);
      if (allSuccess) {
        this.toastr.success(`Link ${link_active ? 'activated' : 'deactivated'} successfully`);
        this.loadMappings();
      } else {
        this.toastr.error('Failed to update some link statuses');
      }
    }).catch(err => {
      this.toastr.error('Error updating link status: ' + (err.error?.message || err.message));
    });
  }

  deleteMapping(collegeId: string) {
    const mappingIds = this.groupedMappings.find(m => m.college_id === collegeId)?.ids || [];
    Promise.all(
      mappingIds.map((id: string) =>
        this.placementService.deleteCollegeJobMapping(id).toPromise()
      )
    ).then(results => {
      const allSuccess = results.every((res: any) => res.success);
      if (allSuccess) {
        this.toastr.success('Mappings deleted successfully');
        this.loadMappings();
      } else {
        this.toastr.error('Failed to delete some mappings');
      }
    }).catch(err => {
      this.toastr.error('Error deleting mappings: ' + (err.error?.message || err.message));
    });
  }

  getPlacementFormLink(collegeId: string): string {
    return `${this.serverPath}/placement/placement-form/${collegeId}`;
  }
}