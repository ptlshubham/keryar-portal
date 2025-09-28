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

  categories: string[] = ['Developer', 'Designer', 'Video Editor'];
  subCategoryMap: { [key: string]: string[] } = {}; // { category: [subCategories] }

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
      subCategories: this.formBuilder.array([])
    });
  }

  get f() { return this.validationForm.controls; }
  get subCategories(): FormArray {
    return this.validationForm.get('subCategories') as FormArray;
  }

  onCategoryChange(selected: string[]) {
    // Reset subCategories array
    while (this.subCategories.length) {
      this.subCategories.removeAt(0);
    }
    // Add a FormArray for each selected category
    selected.forEach(cat => {
      this.subCategories.push(this.formBuilder.group({
        category: [cat],
        subCategoryNames: this.formBuilder.array([this.formBuilder.control('', Validators.required)])
      }));
    });
  }

  addSubCategoryField(catIndex: number) {
    const subCatGroup = this.subCategories.at(catIndex).get('subCategoryNames') as FormArray;
    subCatGroup.push(this.formBuilder.control('', Validators.required));
  }

  removeSubCategoryField(catIndex: number, subIndex: number) {
    const subCatGroup = this.subCategories.at(catIndex).get('subCategoryNames') as FormArray;
    if (subCatGroup.length > 1) subCatGroup.removeAt(subIndex);
  }

  getPagintaion() {
    // this.paginateData = this.imagesData
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  getSubCategoryNames(group: any) {
    return group.get('subCategoryNames') as FormArray;
  }

}
