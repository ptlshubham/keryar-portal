import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.scss'
})
export class AddBlogComponent {
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;

  submitted = false;
  validationForm!: FormGroup;
  isEditing = false; // Flag to track if we are editing
  currentBlogId: string | null = null; // To store the ID of the blog being edited

  // Dropdown arrays
  categories: any = [];
  selectedCategory: any;

  // Inner image
  innerImageUrl: any | null = null;
  innerUploading: boolean = false;
  innerUploadProgress: number = 0;
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

  blogData: any = [];

  // pagination
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  keyIndicator = [];
  selectedKeyNo: any;

  constructor(
    public router: Router,
    public formBuilder: UntypedFormBuilder,
    public workfolioService: WorkfolioService,
    public toastr: ToastrService,
    private _lightbox: Lightbox,
  ) {
    this.getAllBlogs();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Blog Management', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      metatitle: ['', [Validators.required]],
      keywords: ['', [Validators.required]],
      metadescription: ['', [Validators.required]],
      blogtitle: ['', [Validators.required]],
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

  AddBlog() {
    this.isOpen = false;
    this.validationForm.reset();
    this.coverImage = null;
    this.innerImageUrl = null;
    this.galleryMultiImage = [];
    this.galleryUploaders = [{ images: [] }];
    this.submitted = false;
    this.isEditing = false;
    this.currentBlogId = null;
    this.getCategories();
  }

  BlogList() {
    this.isOpen = true;
  }

  getCategories() {
    // Initialize categories if needed
    this.categories = [
      { category: 'Technology' },
      { category: 'Design' },
      { category: 'Development' },
      { category: 'Marketing' },
      { category: 'Business' },
      { category: 'Career' }
    ];
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
            this.workfolioService.uploadBlogCover(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000 });
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
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000 });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
      }
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.category;
  }

  addNewCategory(term: string): any {
    return { category: term };
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
            this.workfolioService.uploadBlogMultiImage(formdata).subscribe((response) => {
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
    this.galleryMultiImage = this.galleryUploaders.flatMap(u => u.img ? [u.img] : []);
  }

  submitBlogDetails() {
    this.submitted = true;
    if (this.validationForm.valid) {
      let data = this.validationForm.value;
      data.category = this.selectedCategory;
      data.coverimage = this.coverImage ? this.coverImage : '';
      data.galleryMultiImage = this.galleryMultiImage ? this.galleryMultiImage : [];

      if (this.isEditing && this.currentBlogId) {
        data.id = this.currentBlogId;
        this.workfolioService.updateBlogData(data).subscribe((res: any) => {
          if (res.success == true) {
            this.validationForm.reset();
            this.coverImage = null;
            this.innerImageUrl = null;
            this.galleryMultiImage = [];
            this.galleryUploaders = [{ images: [] }];
            this.submitted = false;
            this.isOpen = true;
            this.isEditing = false;
            this.currentBlogId = null;
            this.toastr.success('Blog details updated successfully.', 'Success', { timeOut: 2000 });
            this.getAllBlogs();
          } else {
            this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
          }
        });
      } else {
        this.workfolioService.saveBlogData(data).subscribe((res: any) => {
          if (res.success == true) {
            this.validationForm.reset();
            this.coverImage = null;
            this.innerImageUrl = null;
            this.galleryMultiImage = [];
            this.galleryUploaders = [{ images: [] }];
            this.submitted = false;
            this.isOpen = true;
            this.toastr.success('Blog details saved successfully.', 'Success', { timeOut: 2000 });
            this.getAllBlogs();
          } else {
            this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
          }
        });
      }
    }
  }

  getAllBlogs() {
    this.workfolioService.getAllBlogData().subscribe((res: any) => {
      console.log('getAllBlogs - blogData:', res);
      this.blogData = res;
      this.album = this.blogData.map((s: any) => ({
        src: this.serverPath + s.coverimage,
        caption: `${s.blogtitle}`,
        thumb: this.serverPath + s.coverimage
      }));
      for (let i = 0; i < this.blogData.length; i++) {
        this.blogData[i].index = i + 1;
      }
      this.collectionSize = this.blogData.length;
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

  getPagintaion() {
    this.paginateData = this.blogData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  activeBanners(ind: any) {
    let inde = ind - 1;
    this.blogData[inde].isactive = true;
    this.workfolioService.updateBlogActiveDeactive(this.blogData[inde]).subscribe((req) => {
      this.toastr.success('Blog activated Successfully.', 'Activated', {
        timeOut: 3000,
      });
      this.getAllBlogs();
    });
  }

  deactiveBanners(ind: any) {
    let inde = ind - 1;
    this.blogData[inde].isactive = false;
    this.workfolioService.updateBlogActiveDeactive(this.blogData[inde]).subscribe((req) => {
      this.toastr.error('Blog deactivated Successfully.', 'Deactivated', {
        timeOut: 3000,
      });
      this.getAllBlogs();
    });
  }

  removeBlogById(id: any) {
    this.workfolioService.removeBlogDetailsById(id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Blog details removed successfully.', 'Deleted', { timeOut: 2000 });
        this.getAllBlogs();
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
      }
    });
  }

  editBlogById(data: any) {
    this.isOpen = false;
    this.isEditing = true;
    this.currentBlogId = data.id;

    // Format publishdate to YYYY-MM-DD in local timezone
    let formattedPublishDate = '';
    if (data.publishdate) {
      formattedPublishDate = moment(data.publishdate).format('YYYY-MM-DD');
    }

    this.validationForm.patchValue({
      metatitle: data.metatitle,
      keywords: data.keywords,
      metadescription: data.metadescription,
      blogtitle: data.blogtitle,
      category: data.category,
      authorname: data.authorname,
      description: data.description,
      publishdate: formattedPublishDate,
    });
    this.coverImage = data.coverimage;
    this.innerImageUrl = this.serverPath + data.coverimage;
    this.galleryMultiImage = Array.isArray(data.galleryImages) ? data.galleryImages.map((img: any) => img.image) : [];
    this.galleryUploaders = [{ images: this.galleryMultiImage.map((img: string) => this.serverPath + img), img: this.galleryMultiImage[0] || '' }];
    this.selectedCategory = data.category;
    this.getCategories();
  }

  onKeyIndicatorChange(event: any) {
    this.selectedKeyNo = event.keyno;
  }

  addNewIndicator(term: string): any {
    return { keyno: term };
  }
}
