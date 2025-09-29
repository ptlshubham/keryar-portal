import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  breadCrumbItems!: Array<{}>;

  submitted = false;
  validationForm!: FormGroup;
  imageUrl: any | null = null;
  cardImageBase64: any;
  clientImage: any;
  progressValue: number = 0;
  progressType: string = 'success';
  isProgress: boolean = false;
  uploading: boolean = false;
  uploadProgress: number = 0;

  serverPath: string = 'http://localhost:8300';
  clientsData: any = [];
  album: Array<{ src: string; caption: string; thumb: string }> = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    public toastr: ToastrService,
    public workfolioService: WorkfolioService,
    public router: Router,
    public formBuilder: UntypedFormBuilder,
    private _lightbox: Lightbox,

  ) {
    this.getClients();
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Generate Tokens', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      name: ['', [Validators.required]],

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
            this.workfolioService.uploadClientLogo(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.clientImage = response;
            });

          } else {
            this.uploadProgress += 10;
          }
        }, 100);
      };

      reader.readAsDataURL(file);
    }
  }

  submitClientDetails() {
    this.submitted = true;
    if (this.validationForm.valid) {
      let data = {
        name: this.validationForm.value.name,
        logo: this.clientImage ? this.clientImage : '',
        isactive: true,
      }
      this.workfolioService.saveClientDetails(data).subscribe((res: any) => {
        if (res.success == true) {
          this.getClients();
          this.toastr.success('Client Details Saved Successfully', 'Saved', { timeOut: 3000, });
          this.validationForm.reset();
          this.clientImage = null;
          this.imageUrl = null;
        } else {
          this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 3000, });
        }
      })
    }
  }

  removeUploadedImage(img: any) {
    let data = {
      img: this.clientImage
    };
    this.workfolioService.deleteUploadedImageFromFolder(data).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.clientImage = null;
    this.imageUrl = null;
  }
  getClients() {
    this.workfolioService.getAllClients().subscribe((res: any) => {
      this.clientsData = res;

      this.album = this.clientsData.map((s: any) => ({
        src: this.serverPath + s.logo,
        caption: `${s.name}`,
        thumb: this.serverPath + s.logo
      }));
      for (let i = 0; i < this.clientsData.length; i++) {
        this.clientsData[i].index = i + 1;
      }
      this.collectionSize = this.clientsData.length;
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
  getPagintaion() {
    this.paginateData = this.clientsData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  activeClient(ind: any) {
    let inde = ind - 1;
    this.clientsData[inde].isactive = true;
    this.workfolioService.updateClientActiveDeactive(this.clientsData[inde]).subscribe((req) => {
      this.toastr.success('Client activated Successfully.', 'Activated', {
        timeOut: 3000,
      });
    })
  }
  deactiveClient(ind: any) {
    let inde = ind - 1;
    this.clientsData[inde].isactive = false;
    this.workfolioService.updateClientActiveDeactive(this.clientsData[inde]).subscribe((req) => {
      this.toastr.error('Client deactivated Successfully.', 'Deactivated', {
        timeOut: 3000,
      });
    })
  }

  removeClientsData(id: any) {
    this.workfolioService.removeClientDetailsById(id).subscribe((res: any) => {
      this.clientsData = res;
      this.toastr.success('Image Delete Successfully.', 'Deleted', {
        timeOut: 3000,
      });
      this.getClients();
    })
  }
}
