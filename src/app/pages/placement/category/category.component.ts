import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;
  imageUrl: any | null = null;
  cardImageBase64: any;
  tokenImage: any;
  progressValue: number = 0;

  serverPath: string = 'https://api.cesociety.in';

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

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
      { label: 'Generate Tokens', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      title: ['']

    });
  }

  get f() { return this.validationForm.controls; }




  getPagintaion() {
    // this.paginateData = this.imagesData
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

}
