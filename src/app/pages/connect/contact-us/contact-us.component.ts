import { Component, OnInit } from '@angular/core';
import { ConnectService } from 'src/app/core/services/connect.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // ⬅️ add this
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  internshipFormDetails: any = [];
  selectedData: any = null;

  constructor(
    public connectService: ConnectService,
    public toastr: ToastrService,
    private modalService: NgbModal // ⬅️ add this
  ) { }

  ngOnInit(): void {
    this.getInternshipDetails();
  }

  getPagintaion() {
    this.paginateData = this.internshipFormDetails
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  // ⬇️ New: open preview
  openPreview(client: any, modalTpl: any) {
    this.selectedData = client;
    this.modalService.open(modalTpl, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  removeContactusDetails(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this contact entry? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.connectService.removeContactusFormDetails(id).subscribe({
          next: (res: any) => {
            this.internshipFormDetails = res;
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Contact details deleted successfully.',
              timer: 3000,
              showConfirmButton: false
            });
            this.getInternshipDetails(); // Refresh data after deletion
          },
          error: (err) => {
            console.error('Delete API Error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete contact details. Please try again.',
              timer: 3000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }


  getInternshipDetails() {
    this.connectService.getContactusFormDetails().subscribe((res: any) => {
      this.internshipFormDetails = res;
      for (let i = 0; i < this.internshipFormDetails.length; i++) {
        this.internshipFormDetails[i].index = i + 1;
      }
      this.collectionSize = this.internshipFormDetails.length;
      this.getPagintaion();
    });
  }
}
