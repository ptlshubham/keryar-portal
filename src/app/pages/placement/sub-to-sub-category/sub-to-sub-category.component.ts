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
  serverPath: string = 'https://api.cesociety.in';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  categories: string[] = ['Developer', 'Designer', 'Q/A', 'Graphic Designer', 'Video Editor'];
  categoriesWithSub: any[] = [
    { category: 'Developer', name: 'Full Stack Developer' },
    { category: 'Developer', name: 'MERN Stack Developer' },
    { category: 'Developer', name: 'MEAN Stack Developer' },
    { category: 'Developer', name: 'Node JS Developer' },
    { category: 'Developer', name: 'React JS Developer' },
    { category: 'Developer', name: 'Angular Developer' },
    { category: 'Designer', name: 'UI Designer' },
    { category: 'Designer', name: 'UX Designer' },
    { category: 'Q/A', name: 'Manual Tester' },
    { category: 'Q/A', name: 'Automation Tester' },
    { category: 'Graphic Designer', name: 'Logo Designer' },
    { category: 'Video Editor', name: 'YouTube Editor' }
  ];


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
      selectedCategories: [[], [Validators.required]],
      selectsubcategory: [[], [Validators.required]],
      subToSubCategories: this.formBuilder.array([this.formBuilder.control('', Validators.required)])
    });
  }

  get f() { return this.validationForm.controls; }
  get subToSubCategories(): FormArray {
    return this.validationForm.get('subToSubCategories') as FormArray;
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

