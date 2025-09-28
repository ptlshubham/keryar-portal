import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss'
})
export class SubCategoryComponent {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;
  serverPath: string = 'https://api.cesociety.in';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  categories: string[] = ['Category A', 'Category B', 'Category C', 'Category D'];

  constructor(
    // public toastr: ToastrService,
    // public homeService: HomeService,
    public router: Router,
    public formBuilder: UntypedFormBuilder,

  ) {
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Sub-Category', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      selectedCategories: [[], [Validators.required]],
      subCategories: this.formBuilder.array([this.formBuilder.control('', Validators.required)])
    });
  }

  get f() { return this.validationForm.controls; }
  get subCategories(): FormArray {
    return this.validationForm.get('subCategories') as FormArray;
  }

  addSubCategory() {
    this.subCategories.push(this.formBuilder.control('', Validators.required));
  }

  removeSubCategory(index: number) {
    if (this.subCategories.length > 1) {
      this.subCategories.removeAt(index);
    }
  }

  getPagintaion() {
    // this.paginateData = this.imagesData
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

}
