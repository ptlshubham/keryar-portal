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

  // Outer image
  imageUrl: any | null = null;
  cardImageBase64: any;
  tokenImage: any;
  progressType: string = 'success';
  uploading: boolean = false;
  uploadProgress: number = 0;

  // Inner image
  innerImageUrl: any | null = null;
  innerUploading: boolean = false;
  innerUploadProgress: number = 0;

  // Gallery images
  galleryImages: string[] = [];
  galleryUploading: boolean = false;
  galleryUploadProgress: number = 0;

  serverPath: string = 'https://api.cesociety.in';

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
            this.cardImageBase64 = reader.result;
            // API upload logic here
          } else {
            this.uploadProgress += 10;
          }
        }, 100);
      };

      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage(img: any) {
    this.tokenImage = null;
    this.imageUrl = null;
    this.uploadProgress = 0;
    this.uploading = false;
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

  addGalleryImage(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.galleryUploading = true;
      let loaded = 0;
      Array.from(files).forEach((file: any, idx: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.galleryImages.push(reader.result as string);
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

  removeGalleryImage(index: number) {
    this.galleryImages.splice(index, 1);
  }
}
