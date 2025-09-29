import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; active?: boolean }>;

  validationForm!: FormGroup;
  submitted = false;

  // table pagination/demo data (replace with your API)
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any[] = [];

  // single-select categories
  categories: string[] = ['Developer', 'Designer', 'Video Editor'];

  constructor(
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
      subCategories: this.fb.array([]) // array of strings
    });

    // demo list data
    this.collectionSize = 3;
    this.paginateData = [];
  }

  // convenience getters
  get f() { return this.validationForm.controls; }
  get subCategories(): FormArray {
    return this.validationForm.get('subCategories') as FormArray;
  }

  // on single-select change
  onCategoryChange(selected: string) {
    // whenever category changes, reset sub-categories
    while (this.subCategories.length) {
      this.subCategories.removeAt(0);
    }

    if (selected) {
      // start with one input
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
    if (this.validationForm.invalid) return;

    const payload = this.validationForm.value;
    // payload example:
    // {
    //   selectedCategory: 'Developer',
    //   subCategories: ['Frontend', 'Backend']
    // }
    console.log('Submit payload:', payload);

    // TODO: call your API here and then refresh list/table if needed
  }

  getPagintaion() {
    // hook your pagination logic here
  }
}
