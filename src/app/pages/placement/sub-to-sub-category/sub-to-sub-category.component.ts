import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-to-sub-category',
  templateUrl: './sub-to-sub-category.component.html',
  styleUrl: './sub-to-sub-category.component.scss'
})
export class SubToSubCategoryComponent {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;
  serverPath: string = 'http://localhost:8300';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  categories: string[] = ['Developer', 'Designer', 'Video Editor'];
  subCategoryOptions: { [key: string]: string[] } = {
    'Developer': ['Full Stack', 'Frontend', 'Backend'],
    'Designer': ['Figma', 'UI/UX'],
    'Video Editor': ['YouTube', 'Shorts']
  };
  filteredSubCategories: string[] = [];

  constructor(
    public router: Router,
    public formBuilder: UntypedFormBuilder,

  ) {
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Sub To Sub Category', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      selectedCategory: ['', Validators.required],
      selectedSubCategory: ['', Validators.required],
      subToSubCategories: this.formBuilder.array([this.formBuilder.control('', Validators.required)])
    });
  }

  get f() { return this.validationForm.controls; }
  get subToSubCategories(): FormArray {
    return this.validationForm.get('subToSubCategories') as FormArray;
  }

  onCategoryChange(category: string) {
    this.filteredSubCategories = this.subCategoryOptions[category] || [];
    this.validationForm.patchValue({ selectedSubCategory: '' });
  }

  addSubToSubCategory() {
    this.subToSubCategories.push(this.formBuilder.control('', Validators.required));
  }

  removeSubToSubCategory(index: number) {
    if (this.subToSubCategories.length > 1) {
      this.subToSubCategories.removeAt(index);
    }
  }
  getPagintaion() {
    // this.paginateData = this.imagesData
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}

