import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';

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
  clientsData: any = [];
  selectedClientName: any;

  categories: any = [];
  selectedCategory: any;

  // Inner image
  coverImageUrl: any | null = null;
  coverUploading: boolean = false;
  coverUploadProgress: number = 0;
  cardImageBase64: any;

  coverImage: any;
  album: Array<{ src: string; caption: string; thumb: string }> = [];

  // Gallery images
  galleryImages: string[] = [];
  galleryUploading: boolean = false;
  galleryUploadProgress: number = 0;
  galleryUploaders: { images: string[]; img?: any }[] = [{ images: [] }];

  serverPath: string = 'http://localhost:8300';
  galleryMultiImage: any[] = [];

  isOpen: boolean = true;

  portfolioData: any = [];

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
    this.getAllPortfolio();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Client Portfolio', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      clientname: [null, [Validators.required]],
      category: [null, [Validators.required]],
      authorname: ['', [Validators.required]],
      description: ['', [Validators.required]],
      publishdate: ['', [Validators.required]],
    });
  }

  get f() { return this.validationForm.controls; }

  addGalleryUploader() {
    this.galleryUploaders.push({ images: [] });
  }

  addPortfolio() {
    this.isOpen = false;
    this.validationForm.reset();
    this.coverImage = null;
    this.coverImageUrl = null;
    this.galleryMultiImage = [];
    this.galleryUploaders = [{ images: [] }];
    this.submitted = false;
    this.getClients();
  }

  portfolioList() {
    this.isOpen = true;
  }

  getClients() {
    this.workfolioService.getAllClients().subscribe((res: any) => {
      this.clientsData = res;
    });
  }

  uploadInnerImageFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.coverUploading = true;
      const reader = new FileReader();

      reader.onload = () => {
        const interval = setInterval(() => {
          if (this.coverUploadProgress >= 100) {
            clearInterval(interval);
            this.coverUploading = false;
            this.coverImageUrl = reader.result as string;
            // API upload logic
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.workfolioService.uploadPortfolioCover(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000 });
              this.coverImage = response;
            });
          } else {
            this.coverUploadProgress += 10;
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
        this.coverImageUrl = null;
        this.coverUploadProgress = 0;
        this.coverUploading = false;
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000 });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
      }
    });
  }

  onNameChange(event: any) {
    this.selectedClientName = event.name;
  }

  addNewName(term: string): any {
    return { name: term };
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.category;
  }

  addNewCategory(term: string): any {
    return { category: term };
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

            // API upload logic
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.workfolioService.uploadPortfolioMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000 });
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
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000 });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
      }
    });
    this.galleryUploaders[uploaderIndex].images.splice(imageIndex, 1);
  }

  submitPortfolioDetails() {
    this.submitted = true;
    if (this.validationForm.valid) {
      let data = this.validationForm.value;
      data.clientname = this.selectedClientName;
      data.category = this.selectedCategory;
      data.coverimage = this.coverImage ? this.coverImage : '';
      data.galleryMultiImage = this.galleryMultiImage ? this.galleryMultiImage : [];

      this.workfolioService.savePortfolioData(data).subscribe((res: any) => {
        if (res.success == true) {
          this.validationForm.reset();
          this.coverImage = null;
          this.coverImageUrl = null;
          this.galleryMultiImage = [];
          this.galleryUploaders = [{ images: [] }];
          this.submitted = false;
          this.isOpen = true;
          this.toastr.success('Portfolio details saved successfully.', 'Success', { timeOut: 2000 });
        } else {
          this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
        }
      });
    }
  }

  getAllPortfolio() {
    this.workfolioService.getAllPortfolioData().subscribe((res: any) => {
      console.log('getAllPortfolio - portfolioData:', res);
      this.portfolioData = res;
      this.album = this.portfolioData.map((s: any) => ({
        src: this.serverPath + s.coverimage,
        caption: `${s.name}`,
        thumb: this.serverPath + s.coverimage
      }));
      for (let i = 0; i < this.portfolioData.length; i++) {
        this.portfolioData[i].index = i + 1;
      }
      this.collectionSize = this.portfolioData.length;
      this.getPagintaion();
    });
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
    this.paginateData = this.portfolioData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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

  removePortfolioById(id: any) {
    this.workfolioService.removePortfolioDetailsById(id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Portfolio details removed successfully.', 'Deleted', { timeOut: 2000 });
        this.getAllPortfolio();
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
      }
    });
  }

  editPortfolioById(data: any) {
    console.log('editPortfolioById - Incoming data:', data);
    console.log('editPortfolioById - Initial galleryUploaders:', this.galleryUploaders); // Debug initial state
    this.isOpen = false;
    // Format publishdate to YYYY-MM-DD for the date input
    let formattedPublishDate = '';
    if (data.publishdate) {
      const date = new Date(data.publishdate);
      formattedPublishDate = date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
    }

    this.validationForm.patchValue({
      title: data.title,
      clientname: data.clientname,
      category: data.category,
      authorname: data.authorname,
      description: data.description,
      publishdate: formattedPublishDate,
    });

    this.coverImage = data.coverimage;
    this.coverImageUrl = this.serverPath + data.coverimage;
    console.log('editPortfolioById - galleryImages:', data.galleryImages);
    // Ensure galleryImages is an array and extract image paths
    this.galleryMultiImage = Array.isArray(data.galleryImages) ? data.galleryImages.map((img: any) => img.image) : [];
    console.log('editPortfolioById - galleryMultiImage:', this.galleryMultiImage);
    // Reset galleryUploaders to a single uploader with existing images only
    this.galleryUploaders = [{ images: this.galleryMultiImage.map((img: string) => this.serverPath + img), img: this.galleryMultiImage[0] || '' }];
    console.log('editPortfolioById - Final galleryUploaders:', this.galleryUploaders);

    this.selectedClientName = data.clientname;
    this.selectedCategory = data.category;
    this.getClients();
  }
}