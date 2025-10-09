import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';

@Component({
  selector: 'app-college-list',
  standalone: false,
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss'
})
export class CollegeListComponent {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;

  serverPath: string = 'https://api.fosterx.co';
  CollegeData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    public toastr: ToastrService,
    public router: Router,
    public formBuilder: UntypedFormBuilder,
    private placemetService: PlacementService
  ) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Manage Colleges', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.getColleges();
  }

  get f() { return this.validationForm.controls; }

  submitCollegeData() {
    this.submitted = true;
    if (this.validationForm.valid) {
      const collegeData = {
        name: this.validationForm.value.name,
        isactive: true
      };
      this.placemetService.saveCollegeDetails(collegeData).subscribe(
        (res: any) => {
          if (res.success) {
            this.toastr.success('College details saved successfully.', 'Success', {
              timeOut: 3000,
            });
            this.validationForm.reset();
            this.submitted = false;
            this.getColleges();
          } else {
            this.toastr.error('Failed to save college details.', 'Error', {
              timeOut: 3000,
            });
          }
        },
        (err) => {
          this.toastr.error('Error saving college details.', 'Error', {
            timeOut: 3000,
          });
        }
      );
    }
  }

  getColleges() {
    this.placemetService.getAllColleges().subscribe((res: any) => {
      this.CollegeData = res;
      this.collectionSize = this.CollegeData.length;
      this.getPagintaion();
    });
  }

  getPagintaion() {
    this.paginateData = this.CollegeData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  activeCollege(ind: any) {
    let inde = ind - 1;
    this.CollegeData[inde].isactive = true;
    this.placemetService.updateCollegeActiveDeactive(this.CollegeData[inde]).subscribe((req) => {
      this.toastr.success('College activated successfully.', 'Activated', {
        timeOut: 3000,
      });
      this.getColleges();
    });
  }

  deactiveCollege(ind: any) {
    let inde = ind - 1;
    this.CollegeData[inde].isactive = false;
    this.placemetService.updateCollegeActiveDeactive(this.CollegeData[inde]).subscribe((req) => {
      this.toastr.error('College deactivated successfully.', 'Deactivated', {
        timeOut: 3000,
      });
      this.getColleges();
    });
  }

  removeCollegeData(id: any) {
    this.placemetService.removeCollegeDetailsById(id).subscribe((res: any) => {
      this.toastr.success('College deleted successfully.', 'Deleted', {
        timeOut: 3000,
      });
      this.getColleges();
    });
  }
}