import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-to-sub-category',
  templateUrl: './sub-to-sub-category.component.html',
  styleUrls: ['./sub-to-sub-category.component.scss']
})
export class SubToSubCategoryComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; active?: boolean }>;

  validationForm!: FormGroup;
  submitted = false;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any[] = [];

  categories: any[] = [];
  subCategories: any[] = [];
  filteredSubCategories: any[] = [];

  constructor(
    public toastr: ToastrService,
    public placementService: PlacementService,
    public router: Router,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Sub To Sub Category', active: true }
    ];

    this.validationForm = this.formBuilder.group({
      selectedCategory: ['', Validators.required],
      selectedSubCategory: ['', Validators.required], // Changed to single value
      subToSubCategories: this.formBuilder.array([this.formBuilder.control('', Validators.required)]),
      isactive: [true, Validators.required]
    });

    this.getCategories();
    this.getSubCategories();
    this.getPagintaion();
  }

  get f() { return this.validationForm.controls; }
  get subToSubCategories(): FormArray {
    return this.validationForm.get('subToSubCategories') as FormArray;
  }

  getCategories() {
    this.placementService.getAllActivePlacementCategory().subscribe({
      next: (res: any) => {
        this.categories = res;
        console.log('Fetched categories:', this.categories);
      },
      error: (err) => {
        this.toastr.error('Failed to fetch categories', 'Error');
        console.error('Error fetching categories:', err);
      }
    });
  }

  getSubCategories() {
    this.placementService.getAllActiveSubCategory().subscribe({
      next: (res: any) => {
        console.log('Raw response from GetAllActiveSubCategory:', res);
        this.subCategories = res.data || [];
        console.log('Fetched sub-categories:', this.subCategories);
        this.onCategoryChange(this.f.selectedCategory.value);
      },
      error: (err) => {
        this.toastr.error('Failed to fetch sub-categories', 'Error');
        console.error('Error fetching sub-categories:', err);
      }
    });
  }

  onCategoryChange(category: any) {
    const categoryId = category ? category.id : null;
    console.log('Selected category:', category);
    console.log('Extracted category ID:', categoryId);
    console.log('All sub-categories before filtering:', this.subCategories);
    this.filteredSubCategories = categoryId
      ? this.subCategories.filter(sc => {
        const match = sc.categoriesid === categoryId;
        console.log(`Comparing sub-category categoriesid: ${sc.categoriesid} with categoryId: ${categoryId} -> ${match}`);
        return match;
      })
      : [];
    console.log('Filtered sub-categories:', this.filteredSubCategories);
    this.validationForm.patchValue({ selectedSubCategory: '' }); // Reset to single value
  }

  addSubToSubCategory() {
    this.subToSubCategories.push(this.formBuilder.control('', Validators.required));
  }

  removeSubToSubCategory(index: number) {
    if (this.subToSubCategories.length > 1) {
      this.subToSubCategories.removeAt(index);
    }
  }

  submit() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      this.toastr.error('Please fill all required fields', 'Error');
      return;
    }

    const selectedSubCategory = this.validationForm.value.selectedSubCategory;
    console.log('Selected sub-category:', selectedSubCategory);

    const payload = {
      subcategoriesId: selectedSubCategory, // Changed to single ID
      subToSubCategories: this.validationForm.value.subToSubCategories,
      isactive: this.validationForm.value.isactive ? 1 : 0
    };

    console.log('Submit payload:', payload);

    this.placementService.saveSubToSubCategory(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.validationForm.reset();
          this.submitted = false;
          while (this.subToSubCategories.length) {
            this.subToSubCategories.removeAt(0);
          }
          this.subToSubCategories.push(this.formBuilder.control('', Validators.required));
          this.filteredSubCategories = [];
          this.getPagintaion();
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to save sub-to-sub categories', 'Error');
        console.error('Error saving sub-to-sub categories:', err);
      }
    });
  }

  getPagintaion() {
    this.placementService.getAllSubToSubCategory().subscribe({
      next: (res: any) => {
        const groupedData = res.data || [];
        this.collectionSize = groupedData.length;
        this.paginateData = groupedData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize).map((item: any) => {
          const isactivesArr = item.isactives ? item.isactives.split(',') : [];
          const allActive = isactivesArr.length > 0 && isactivesArr.every((v: string) => v === '1');
          const allInactive = isactivesArr.length > 0 && isactivesArr.every((v: string) => v === '0');
          const mixed = isactivesArr.length > 0 && !allActive && !allInactive;
          return {
            ...item,
            allActive,
            allInactive,
            mixed
          };
        });
        console.log('Paginated sub-to-sub categories:', this.paginateData);
      },
      error: (err) => {
        this.toastr.error('Failed to fetch sub-to-sub categories', 'Error');
        console.error('Error fetching sub-to-sub categories:', err);
      }
    });
  }

  updateSubToSubCategoryStatus(ids: string[], isactive: boolean) {
    this.placementService.updateSubToSubCategoryStatus(ids, isactive ? 1 : 0).subscribe({
      next: (res: any) => {
        this.toastr.success('Sub-to-sub category status updated successfully', 'Success');
        this.getPagintaion();
      },
      error: (err) => {
        this.toastr.error('Failed to update sub-to-sub category status', 'Error');
        console.error('Error updating sub-to-sub category status:', err);
      }
    });
  }

  removeSubToSubCategories(ids: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this sub-to-sub category group?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.placementService.removeSubToSubCategory(ids.split(',')).subscribe({
          next: (res: any) => {
            this.toastr.success('Sub-to-sub category deleted successfully', 'Success');
            this.getPagintaion();
          },
          error: (err) => {
            this.toastr.error('Failed to delete sub-to-sub category', 'Error');
            console.error('Error deleting sub-to-sub category:', err);
          }
        });
      }
    });
  }
}