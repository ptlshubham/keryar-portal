import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

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
  imageUrl: any | null = null;
  cardImageBase64: any;
  tokenImage: any;
  progressValue: number = 0;
  progressType: string = 'success';
  isProgress: boolean = false;
  uploading: boolean = false;
  uploadProgress: number = 0;
  isOpen: boolean = true;
  serverPath: string = 'https://api.cesociety.in';

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  categories: string[] = ['Design', 'Development', 'Marketing', 'Consulting']; // Example categories

  innerImageUrl: any | null = null;
  innerUploading: boolean = false;
  innerUploadProgress: number = 0;

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
      name: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      publishedDate: ['', [Validators.required]],
    });
  }

  get f() { return this.validationForm.controls; }


  uploadImageFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      const reader = new FileReader();

      reader.onload = () => {
        const interval = setInterval(() => {
          if (this.uploadProgress >= 100) {
            clearInterval(interval);
            this.uploading = false;
            this.imageUrl = reader.result as string;

            // API upload logic
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            // this.tokensService.uploadTokenImage(formdata).subscribe((response) => {
            //   this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
            //   this.tokenImage = response;
            // });

          } else {
            this.uploadProgress += 10;
          }
        }, 100);
      };

      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage(img: any) {
    let data = {
      img: this.tokenImage
    };
    // this.homeService.deleteImageFromDb(data).subscribe((res: any) => {
    //   if (res.success == true) {
    //     this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
    //   } else {
    //     this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
    //   }
    // })
    this.tokenImage = null;
    this.imageUrl = null;
  }
  getImagesDataById() {
    // this.homeService.getBannersImagesById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
    //   this.imagesData = res;
    //   this.filterdata = res;
    //   this.album = this.filterdata.map((s: any) => ({
    //     src: `https://api.cesociety.in${s.image}`,
    //     caption: `${s.purpose}`,
    //     thumb: `https://api.cesociety.in${s.image}`
    //   }));
    //   for (let i = 0; i < this.imagesData.length; i++) {
    //     this.imagesData[i].index = i + 1;
    //   }
    //   this.collectionSize = this.imagesData.length;
    //   this.getPagintaion();
    // })
  }
  openImage(globalIndex: number): void {
    // Only open if the image exists in album
    // if (this.album[globalIndex] && this.album[globalIndex].src && !this.album[globalIndex].src.endsWith('null')) {
    //   this._lightbox.open(this.album, globalIndex, {
    //     showZoom: true,
    //     centerVertically: true,
    //     wrapAround: true,
    //     showImageNumberLabel: true,
    //     showDownloadButton: true,
    //     showThumbnails: true
    //   });
    // }
  }
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

  removeBannersImages(id: any) {
    let data = {
      id: id,
      institute_id: localStorage.getItem('InstituteId')
    }
    // this.homeService.removeBannersImagesById(data).subscribe((res: any) => {
    //   this.imagesData = res;
    //   this.toastr.success('Image Delete Successfully.', 'Deleted', {
    //     timeOut: 3000,
    //   });
    //   this.getImagesDataById();
    // })
  }
  addCaseStudy() {
    this.isOpen = false;
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
}
