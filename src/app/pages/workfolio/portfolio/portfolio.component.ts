import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;

  submitted = false;
  validationForm!: FormGroup;

  // Dropdown arrays
  clients: string[] = ['Client A', 'Client B', 'Client C'];
  categories: string[] = ['Design', 'Development', 'Marketing'];



  // Inner image
  innerImageUrl: any | null = null;
  innerUploading: boolean = false;
  innerUploadProgress: number = 0;

  // Gallery images
  galleryImages: string[] = [];
  galleryUploading: boolean = false;
  galleryUploadProgress: number = 0;
  galleryUploaders: { images: string[] }[] = [{ images: [] }];

  serverPath: string = 'http://localhost:8300';



  keyIndicator = [];
  selectedKeyNo: any;

  isOpen: boolean = true;


  // pagination
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    public router: Router,
    public formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Client Portfolio', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      clientname: ['', [Validators.required]],
      category: ['', [Validators.required]],
      authorname: ['', [Validators.required]],
      description: ['', [Validators.required]],
      publishedDate: ['', [Validators.required]],
    });
  }

  get f() { return this.validationForm.controls; }



  uploadInnerImageFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.innerUploading = true;
      const reader = new FileReader();

      reader.onload = () => {
        const interval = setInterval(() => {
          if (this.innerUploadProgress >= 100) {
            clearInterval(interval);
            this.innerUploading = false;
            this.innerImageUrl = reader.result as string;
          } else {
            this.innerUploadProgress += 10;
          }
        }, 100);
      };

      reader.readAsDataURL(file);
    }
  }

  removeUploadedInnerImage() {
    this.innerImageUrl = null;
    this.innerUploadProgress = 0;
    this.innerUploading = false;
  }



  onKeyIndicatorChange(event: any) {
    this.selectedKeyNo = event.keyno
  }
  addNewIndicator(term: string): any {
    return { keyno: term };
  }

  // gallery images
  removeGalleryUploader(uploaderIndex: number) {
    this.galleryUploaders.splice(uploaderIndex, 1);
  }

  addGalleryImage(event: any, uploaderIndex: number) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.galleryUploading = true;
      let loaded = 0;
      Array.from(files).forEach((file: any, idx: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.galleryUploaders[uploaderIndex].images.push(reader.result as string);
          loaded++;
          if (loaded === files.length) {
            this.galleryUploading = false;
            this.galleryUploadProgress = 0;
          }
        };
        reader.readAsDataURL(file);
      });
      // Simulate progress
      this.galleryUploadProgress = 0;
      const interval = setInterval(() => {
        if (this.galleryUploadProgress >= 100) {
          clearInterval(interval);
        } else {
          this.galleryUploadProgress += 20;
        }
      }, 100);
    }
  }

  removeGalleryImage(uploaderIndex: number, imageIndex: number) {
    this.galleryUploaders[uploaderIndex].images.splice(imageIndex, 1);
  }
  addGalleryUploader() {
    this.galleryUploaders.push({ images: [] });
  }
  addPortfolio() {
    this.isOpen = false;
  }
  portfolioList() {
    this.isOpen = true;
  }
  // pagination
  getPagintaion() {
    // this.paginateData = this.imagesData
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  activeBanners(ind: any) {
    let inde = ind - 1;
    // this.imagesData[inde].isactive = true;
    // this.homeService.activeDeavctiveBanners(this.imagesData[inde]).subscribe((req) => {
    //   this.toastr.success('Images activated Successfully.', 'Activated', {
    //     timeOut: 3000,
    //   });
    // })
  }
  deactiveBanners(ind: any) {
    let inde = ind - 1;
    // this.imagesData[inde].isactive = false;
    // this.homeService.activeDeavctiveBanners(this.imagesData[inde]).subscribe((req) => {
    //   this.toastr.error('Images deactivated Successfully.', 'Deactivated', {
    //     timeOut: 3000,
    //   });
    // })
  }
}
