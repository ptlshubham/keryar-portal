import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;
  serverPath: string = 'http://localhost:8300';

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  categoryData: any = []

  constructor(
    public toastr: ToastrService,
    public placementService: PlacementService,
    public router: Router,
    public formBuilder: UntypedFormBuilder,

  ) {
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Category', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      title: [''],
      isactive: ['']

    });
    this.getCategory();
  }

  get f() { return this.validationForm.controls; }
  submitClientDetails() {
    this.submitted = true;
    if (this.validationForm.valid) {
      let data = {
        category: this.validationForm.value.category,
        title: this.validationForm.value.title,
        isactive: this.validationForm.value.isactive ? 1 : 0  // convert checkbox to 1/0
      };
      this.placementService.savePlacementCategoryDetails(data).subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Client Details Saved Successfully', 'Saved', { timeOut: 3000, });
          this.getCategory();
          this.validationForm.reset();
        } else {
          this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 3000, });
        }
      })
    }
  }
  getCategory() {
    this.placementService.getAllPlacementCategory().subscribe((res: any) => {
      this.categoryData = res;
      for (let i = 0; i < this.categoryData.length; i++) {
        this.categoryData[i].index = i + 1;
      }
      this.collectionSize = this.categoryData.length;
      this.getPagintaion();
    })
  }
  activeDeactivestatus(category: any) {
    const data = category.isactive == 1 ? 0 : 1;

    this.placementService.updateCategoryStatus(category.id, data).subscribe((res: any) => {
      if (res.success) {
        category.isactive = data; // update UI instantly
        this.toastr.success(`Category ${data ? 'Activated' : 'Deactivated'}`, 'Success', { timeOut: 2000 });
        this.getCategory();
      } else {
        this.toastr.error('Failed to update status', 'Error', { timeOut: 2000 });
      }
    });
  }

  removePlacementCategory(id: any) {
    this.placementService.removePlacementCategory(id).subscribe((res: any) => {
      this.categoryData = res;
      this.toastr.success('Image Delete Successfully.', 'Deleted', {
        timeOut: 3000,
      });
      this.getCategory();
    })
  }
  getPagintaion() {
    this.paginateData = this.categoryData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }



}
