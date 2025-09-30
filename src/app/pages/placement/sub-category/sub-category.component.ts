import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; active?: boolean }>;

  validationForm!: FormGroup;
  submitted = false;

  // table pagination/demo data
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any[] = [];

  // single-select categories
  categories: any = [];

  constructor(
    public toastr: ToastrService,
    public placementService: PlacementService,
    public router: Router,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Sub-Category', active: true }
    ];

    this.validationForm = this.fb.group({
      selectedCategory: [null, Validators.required],
      subCategories: this.fb.array([]),
      isactive: [true, Validators.required],
    });

    this.collectionSize = 0;
    this.paginateData = [];
    this.getCategory();
  }

  // convenience getters
  get f() { return this.validationForm.controls; }
  get subCategories(): FormArray {
    return this.validationForm.get('subCategories') as FormArray;
  }

  // on single-select change
  onCategoryChange(selected: string) {
    while (this.subCategories.length) {
      this.subCategories.removeAt(0);
    }

    if (selected) {
      this.subCategories.push(this.fb.control('', Validators.required));
    }
  }

  addSubCategoryField() {
    this.subCategories.push(this.fb.control('', Validators.required));
  }

  removeSubCategoryField(index: number) {
    if (this.subCategories.length > 1) {
      this.subCategories.removeAt(index);
    }
  }

  submit() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      this.toastr.error('Please fill all required fields', 'Error');
      return;
    }

    const payload = {
      categoriesid: this.validationForm.value.selectedCategory,
      subCategories: this.validationForm.value.subCategories,
      isactive: this.validationForm.value.isactive ? 1 : 0
    };

    this.placementService.saveSubCategory(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.validationForm.reset();
          this.submitted = false;
          while (this.subCategories.length) {
            this.subCategories.removeAt(0);
          }
          this.getPagintaion();
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to save sub-categories', 'Error');
        console.error(err);
      }
    });
  }

  getCategory() {
    this.placementService.getAllActivePlacementCategory().subscribe((res: any) => {
      this.categories = res;
      this.getPagintaion();
    });
  }

  getPagintaion() {
    this.placementService.getAllSubCategory().subscribe((res: any) => {
      this.paginateData = res.data.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
      this.collectionSize = res.data.length;
    });
  }

  updateSubCategoryStatus(id: string, status: boolean) {
    this.placementService.updateSubCategoryStatus(id, status ? 1 : 0).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Sub-category status updated successfully', 'Success');
          this.getPagintaion();
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to update sub-category status', 'Error');
        console.error(err);
      }
    });
  }

  removeSubCategory(id: string) {
    if (confirm('Are you sure you want to delete this sub-category?')) {
      this.placementService.removeSubCategory(id).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastr.success('Sub-category deleted successfully', 'Success');
            this.getPagintaion();
          } else {
            this.toastr.error(res.message, 'Error');
          }
        },
        error: (err) => {
          this.toastr.error('Failed to delete sub-category', 'Error');
          console.error(err);
        }
      });
    }
  }
}