import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.scss'
})
export class CaseStudiesComponent {
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;

  submitted = false;
  validationForm!: FormGroup;

  // Dropdown arrays
  clientsData: any = [];
  selectedClientName: any;

  categories: any = [];
  selectedCategory: any;

  // Cover image
  innerImageUrl: any | null = null;
  innerUploading: boolean = false;
  innerUploadProgress: number = 0;
  cardImageBase64: any;
  coverImage: any;

  // Gallery images
  galleryImages: string[] = [];
  galleryUploading: boolean = false;
  galleryUploadProgress: number = 0;
  galleryUploaders: { images: string[]; img?: any }[] = [{ images: [] }];

  serverPath: string = 'http://localhost:8300';
  galleryMultiImage: any[] = [];

  isOpen: boolean = true;

  caseStudyData: any = [];
  album: Array<{ src: string; caption: string; thumb: string }> = [];

  // pagination
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    public router: Router,
    public formBuilder: UntypedFormBuilder,
    public workfolioService: WorkfolioService,
    public toastr: ToastrService,
    private _lightbox: Lightbox,
  ) {
    this.getAllCaseStudies();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Case Studies', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      clientname: [null, [Validators.required]],
      category: [null, [Validators.required]],
      description: ['', [Validators.required]],
      publishdate: ['', [Validators.required]],
    });
  }

  get f() { return this.validationForm.controls; }

  addCaseStudy() {
    this.isOpen = false;
    this.getClients();
  }

  caseStudyList() {
    this.isOpen = true;
  }

  getClients() {
    this.workfolioService.getAllClients().subscribe((res: any) => {
      this.clientsData = res;
    })
  }

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
            // API upload logic
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.workfolioService.uploadCaseStudyCover(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.coverImage = response;
            });

          } else {
            this.innerUploadProgress += 10;
          }
        }, 100);
      };

      reader.readAsDataURL(file);
    }
  }

  removeUploadedInnerImage() {
    let data = {
      img: this.coverImage
    };
    this.workfolioService.deleteUploadedImageFromFolder(data).subscribe((res: any) => {
      if (res.success == true) {
        this.coverImage = null;
        this.innerImageUrl = null;
        this.innerUploadProgress = 0;
        this.innerUploading = false;
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
  }

  onNameChange(event: any) {
    this.selectedClientName = event
  }
  addNewName(term: string): any {
    return { name: term };
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event
  }
  addNewCategory(term: string): any {
    return { category: term };
  }

  // Gallery methods
  addGalleryUploader() {
    this.galleryUploaders.push({ images: [] });
  }

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

            // API upload logic
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.workfolioService.uploadCaseStudyMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.galleryMultiImage.push(response);
              this.galleryUploaders[uploaderIndex].img = response;
            });
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
    let data = {
      img: this.galleryUploaders[uploaderIndex].img
    };
    this.workfolioService.deleteUploadedImageFromFolder(data).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.galleryUploaders[uploaderIndex].images.splice(imageIndex, 1);
  }

  submitCaseStudyDetails() {
    this.submitted = true;
    if (this.validationForm.valid) {
      let data = this.validationForm.value;
      data.clientname = this.selectedClientName.name;
      data.category = this.selectedCategory.category;
      data.coverimage = this.coverImage ? this.coverImage : '';
      data.galleryMultiImage = this.galleryMultiImage ? this.galleryMultiImage : [];
debugger
      this.workfolioService.saveCaseStudyData(data).subscribe((res: any) => {
        if (res.success == true) {
          this.validationForm.reset();
          this.coverImage = null;
          this.innerImageUrl = null;
          this.galleryMultiImage = [];
          this.galleryUploaders = [{ images: [] }];
          this.submitted = false;
          this.isOpen = true;
          this.toastr.success('Case study details saved successfully.', 'Success', { timeOut: 2000, });
          this.getAllCaseStudies();
        } else {
          this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
        }
      });
    }
  }

  getAllCaseStudies() {
    this.workfolioService.getAllCaseStudyData().subscribe((res: any) => {
      this.caseStudyData = res;
      this.album = this.caseStudyData.map((s: any) => ({
        src: this.serverPath + s.image,
        caption: `${s.name}`,
        thumb: this.serverPath + s.image
      }));
      for (let i = 0; i < this.caseStudyData.length; i++) {
        this.caseStudyData[i].index = i + 1;
      }
      this.collectionSize = this.caseStudyData.length;
      this.getPagintaion();
    })
  }

  openImage(globalIndex: number): void {
    if (this.album[globalIndex] && this.album[globalIndex].src && !this.album[globalIndex].src.endsWith('null')) {
      this._lightbox.open(this.album, globalIndex, {
        showZoom: true,
        centerVertically: true,
        wrapAround: true,
        showImageNumberLabel: true,
        showDownloadButton: true,
        showThumbnails: true
      });
    }
  }

  // pagination
  getPagintaion() {
    this.paginateData = this.caseStudyData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  activeBanners(ind: any) {
    let inde = ind - 1;
    this.caseStudyData[inde].isactive = true;
    this.workfolioService.updateCaseStudyActiveDeactive(this.caseStudyData[inde]).subscribe((req) => {
      this.toastr.success('Case study activated Successfully.', 'Activated', {
        timeOut: 3000,
      });
    })
  }

  deactiveBanners(ind: any) {
    let inde = ind - 1;
    this.caseStudyData[inde].isactive = false;
    this.workfolioService.updateCaseStudyActiveDeactive(this.caseStudyData[inde]).subscribe((req) => {
      this.toastr.error('Case study deactivated Successfully.', 'Deactivated', {
        timeOut: 3000,
      });
    })
  }

  removeBannersImages(id: any) {
    this.workfolioService.removeCaseStudyDetailsById(id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Case study removed successfully.', 'Deleted', { timeOut: 2000, });
        this.getAllCaseStudies();
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
  }

  editCaseStudyById(data: any) {
    this.isOpen = false;
    this.validationForm.patchValue({
      title: data.title,
      clientname: data.clientname,
      category: data.category,
      description: data.description,
      publishdate: data.publishdate,
    });
    this.coverImage = data.image;
    this.innerImageUrl = this.serverPath + data.image;
    this.galleryMultiImage = data.galleryImages;
    this.galleryUploaders = data.galleryImages.map((img: any) => ({ images: [this.serverPath + img], img: img }));
    this.getClients();
  }

  // Legacy compatibility methods (can be removed after updating HTML)
  onKeyIndicatorChange(event: any) {
    this.selectedClientName = event
  }
  addNewIndicator(term: string): any {
    return { keyno: term };
  }
}
