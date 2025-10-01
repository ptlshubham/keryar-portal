import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from 'src/app/core/services/career.service';
import { PlacementService } from 'src/app/core/services/placement.service';

@Component({
  selector: 'app-job-opening',
  templateUrl: './job-opening.component.html',
  styleUrls: ['./job-opening.component.scss']
})
export class JobOpeningComponent {
  breadCrumbItems!: Array<{}>;
  submitted = false;
  validationForm!: FormGroup;
  jobOpeningData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  editMode = false;
  currentJobId: string | null = null;
  isOpen: boolean = true;
  departments: any[] = []; // Categories
  subcategories: any[] = [];
  subtosubcategories: any[] = [];
  questionSets: any[] = [];

  experienceOptions = [
    { label: '0-2 years', value: '0-2 years' },
    { label: '3-5 years', value: '3-5 years' },
    { label: '5+ years', value: '5+ years' }
  ];

  constructor(
    public toastr: ToastrService,
    public careerService: CareerService,
    public router: Router,
    public formBuilder: UntypedFormBuilder,
    public placementService: PlacementService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Career' },
      { label: 'Job Openings', active: true },
    ];
    this.validationForm = this.formBuilder.group({
      jobtitle: ['', [Validators.required]],
      department: [null, [Validators.required]],
      jobtype: [null, [Validators.required]],
      location: ['', [Validators.required]],
      experience: [[], [Validators.required]], // Changed to array for multiple selections
      salary: [''],
      description: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      openings: ['', [Validators.required, Validators.min(1)]],
      questionSets: [[]], // Array for multiple question set IDs
      isactive: [true],
    });

    this.loadCategories();
    this.loadSubcategories();
    this.loadSubToSubcategories();
    this.loadQuestionSets();
    this.loadJobOpenings();
  }

  get f() { return this.validationForm.controls; }

  loadCategories() {
    this.placementService.getAllActivePlacementCategory().subscribe(
      (res: any) => {
        this.departments = res; // Assuming res is an array of { id, name, isactive }
      },
      (error) => {
        this.toastr.error('Failed to load departments', 'Error', { timeOut: 3000 });
        console.error(error);
      }
    );
  }

  loadSubcategories() {
    this.placementService.getAllActiveSubCategory().subscribe(
      (res: any) => {
        this.subcategories = res.data || res;
      },
      (error) => {
        this.toastr.error('Failed to load subcategories', 'Error', { timeOut: 3000 });
        console.error(error);
      }
    );
  }

  loadSubToSubcategories() {
    this.placementService.getAllActiveSubToSubCategory().subscribe(
      (res: any) => {
        this.subtosubcategories = res.data || res;
      },
      (error) => {
        this.toastr.error('Failed to load sub-to-sub categories', 'Error', { timeOut: 3000 });
        console.error(error);
      }
    );
  }

  loadQuestionSets() {
    this.placementService.getAllSelfQuestionSetDetails().subscribe(
      (res: any) => {
        this.questionSets = (res.data || res).map((set: any) => ({
          ...set,
          displayName: `${set.type} - ${set.year} - ${set.difficulty}`
        }));
      },
      (error) => {
        this.toastr.error('Failed to load question sets', 'Error', { timeOut: 3000 });
        console.error(error);
      }
    );
  }

  getQuestionSet(id: string): any {
    const set = this.questionSets.find(set => set.id === id) || {};
    console.log('getQuestionSet:', id, set); // Debug log
    return set;
  }

  getQuestionSetDisplayName(id: string): string {
    const set = this.getQuestionSet(id);
    return set.displayName || 'N/A';
  }

  getCategoryName(id: string): string {
    const category = this.departments.find(cat => cat.id === id);
    return category ? category.name : 'N/A';
  }

  getSubcategoryName(id: string): string {
    const subcategory = this.subcategories.find(sub => sub.id === id);
    return subcategory ? subcategory.name : 'N/A';
  }

  getSubToSubcategoryName(id: string): string {
    const subtosub = this.subtosubcategories.find(ss => ss.id === id);
    return subtosub ? subtosub.name : 'N/A';
  }

  JobList() {
    this.isOpen = true
  }

  addJobOpenings() {
    this.validationForm.reset();
    this.isOpen = false;
  }

  submitJobOpeningsDetails() {
    this.submitted = true;
    if (this.validationForm.valid) {
      const data = {
        ...this.validationForm.value,
        experience: this.validationForm.value.experience.join(','),
        questionsets: this.validationForm.value.questionSets.join(','),
        isactive: this.validationForm.value.isactive ? 1 : 0
      };
      data.id = ''; // Will be generated by the backend
      this.careerService.saveJobOpeningDetails(data).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Job Opening saved successfully', 'Saved', { timeOut: 3000 });
          this.loadJobOpenings();
          this.isOpen = true;
          this.resetForm();
        } else {
          this.toastr.error('Failed to save job opening', 'Error', { timeOut: 3000 });
        }
      });
    }
  }

  updateJobOpeningsDetails() {
    this.submitted = true;
    if (this.validationForm.valid && this.currentJobId) {
      const data = {
        ...this.validationForm.value,
        id: this.currentJobId,
        experience: this.validationForm.value.experience.join(','),
        questionsets: this.validationForm.value.questionSets.join(','),
        isactive: this.validationForm.value.isactive ? 1 : 0
      };
      this.careerService.updateJobOpening(data).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Job Opening updated successfully', 'Updated', { timeOut: 3000 });
          this.loadJobOpenings();
        } else {
          this.toastr.error('Failed to update job opening', 'Error', { timeOut: 3000 });
        }
      });
    }
  }

  getPagintaion() {
    this.paginateData = this.jobOpeningData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  toggleOpeningStatus(c: any) {
    c.isactive = !c.isactive;
    this.careerService.updateJobOpeningActiveDeactive(c).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success(`Job Opening ${c.isactive ? 'activated' : 'deactivated'} successfully`, c.isactive ? 'Activated' : 'Deactivated', { timeOut: 3000 });
      } else {
        this.toastr.error('Failed to update job opening status', 'Error', { timeOut: 3000 });
      }
    });
  }

  removeJobOpeningsData(id: string) {
    this.careerService.deleteJobOpening(id).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Job Opening deleted successfully', 'Deleted', { timeOut: 3000 });
        this.loadJobOpenings();
      } else {
        this.toastr.error('Failed to delete job opening', 'Error', { timeOut: 3000 });
      }
    });
  }

  editJobOpening(id: string) {
    const job = this.jobOpeningData.find((j: any) => j.id === id);
    if (job) {
      this.isOpen = false;
      this.editMode = true;
      this.currentJobId = id;
      const questionSetsValue = job.questionsets ? job.questionsets.split(',') : [];
      console.log('Editing job with questionSets:', questionSetsValue); // Debug log
      this.validationForm.patchValue({
        ...job,
        experience: job.experience ? job.experience.split(',') : [],
        questionSets: questionSetsValue,
        isactive: job.isactive === 1
      });
    }
  }

  resetForm() {
    this.submitted = false;
    this.editMode = false;
    this.currentJobId = null;
    this.validationForm.reset({
      department: null,
      jobtype: null,
      experience: [],
      questionSets: [], // Explicitly set to empty array
      isactive: true
    });
  }

  loadJobOpenings() {
    this.careerService.getAllJobOpenings().subscribe((res: any) => {
      this.jobOpeningData = res.map((job: any) => ({
        ...job,
        questionsets: job.questionsets || '' // Ensure questionsets is a string
      }));
      console.log('Job Opening Data:', this.jobOpeningData); // Debug log
      for (let i = 0; i < this.jobOpeningData.length; i++) {
        this.jobOpeningData[i].index = i + 1;
      }
      this.collectionSize = this.jobOpeningData.length;
      this.getPagintaion();
    });
  }
}