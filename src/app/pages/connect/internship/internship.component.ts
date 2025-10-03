import { Component, OnInit } from '@angular/core';
import { ConnectService } from 'src/app/core/services/connect.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // ⬅️ add this

@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss']
})
export class InternshipComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  internshipFormDetails: any = [];
  selectedClient: any = null;

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
    this.selectedClient = client;
    this.modalService.open(modalTpl, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });
  }

  removeClientsData(id: any) {
    this.connectService.removeInternshipDetails(id).subscribe((res: any) => {
      this.internshipFormDetails = res;
      this.toastr.success('Image Delete Successfully.', 'Deleted', {
        timeOut: 3000,
      });
      this.getInternshipDetails();
    });
  }

  getInternshipDetails() {
    this.connectService.getInternshipFormDetails().subscribe((res: any) => {
      this.internshipFormDetails = res;
      for (let i = 0; i < this.internshipFormDetails.length; i++) {
        this.internshipFormDetails[i].index = i + 1;
      }
      this.collectionSize = this.internshipFormDetails.length;
      this.getPagintaion();
    });
  }
}
