import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConnectService } from 'src/app/core/services/connect.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-call-to-action-list',
  templateUrl: './call-to-action-list.component.html',
  styleUrl: './call-to-action-list.component.scss'
})
export class CallToActionListComponent {
  breadCrumbItems!: Array<{}>;

  inquiryData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  totalPages = 0;

  constructor(
    public toastr: ToastrService,
    public router: Router,
    private connectService: ConnectService
  ) {
    this.getAllCallToActionData();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Call To Action', active: true }
    ];
  }

  getAllCallToActionData() {
    this.connectService.getAllCallToActionData(this.page, this.pageSize).subscribe((res: any) => {
      if (res.success) {
        this.inquiryData = res.data;
        this.collectionSize = res.pagination.totalRecords;
        this.totalPages = res.pagination.totalPages;

        // Add index to each item based on current page
        for (let i = 0; i < this.inquiryData.length; i++) {
          this.inquiryData[i].index = ((this.page - 1) * this.pageSize) + i + 1;
        }

        this.paginateData = this.inquiryData;

      } else {
        this.toastr.error('Failed to fetch call to action data', 'Error', { timeOut: 2000 });
      }
    }, (error) => {
      this.toastr.error('Failed to fetch call to action data', 'Error', { timeOut: 2000 });
    });
  }

  removeCallToActionById(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.connectService.removeCallToActionById(id).subscribe({
          next: (res: any) => {
            if (res.success || res.affectedRows > 0 || Array.isArray(res)) {
              this.toastr.success('Record removed successfully.', 'Deleted', { timeOut: 2000 });
              // Reload current page data
              this.getAllCallToActionData();
            } else {
              this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000 });
            }
          },
          error: (err) => {
            this.toastr.error('Failed to delete record', 'Error', { timeOut: 2000 });
            console.error(err);
          }
        });
      }
    });
  }

  getPagintaion() {
    // Fetch new page data from server
    this.getAllCallToActionData();
  }

  formatTime(date: any): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}

