import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonSevice } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {
  testimonialForm!: FormGroup;
  isOpen = false;
  isUpdate = false;
  isOpenView = false;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  testimonials: any[] = [];
  testimonialModel: any = {};
  viewTestimonial: any = {};
  rating: number = 0;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public commonService: CommonSevice,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.testimonialForm = this.fb.group({
      name: ['', Validators.required],
      rating: ['', Validators.required],
      message: ['', Validators.required],
      isactive: [1, Validators.required],
    });

    this.loadAllTestimonials();
  }

  get f() {
    return this.testimonialForm.controls;
  }

  loadAllTestimonials() {
    this.commonService.getAllTestimonials().subscribe({
      next: (res: any) => {
        this.testimonials = res.data;
        this.collectionSize = this.testimonials.length;
        this.getPagination();
      },
      error: (err) => {
        this.toastr.error('Failed to fetch testimonials', 'Error');
      }
    });
    this.collectionSize = this.testimonials.length;
    this.getPagination();
  }

  /** Pagination */
  getPagination() {
    this.paginateData = this.testimonials.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  /** Open modal for adding testimonial */
  openTestimonialForm() {
    this.isOpen = true;
    this.isUpdate = false;
    this.formReset();
  }

  /** Close modal */
  closeTestimonialForm() {
    this.isOpen = false;
    this.isUpdate = false;
    this.formReset();
  }

  /** Reset form */
  formReset() {
    this.testimonialForm.reset({
      name: '',
      message: '',
      rating: null,
      isactive: 1,
    });
    this.rating = 0;
  }

  /** Star Rating Selection */
  setRating(star: number) {
    this.rating = star;
    this.testimonialForm.patchValue({ rating: star });
  }

  toggleStatus(testimonial: any) {
    //api update testimonial 
    this.commonService.updateTestimonial({ ...testimonial, isactive: testimonial.isactive === 1 ? 0 : 1, id: testimonial.id }).subscribe({
      next: (res) => {
        this.toastr.success(`Testimonial ${testimonial.isactive === 1 ? "Deactivated" : "Activated"} successfully.`);
        testimonial.isactive = testimonial.isactive === 1 ? 0 : 1;
      },
      error: (err) => {
        this.toastr.error('Error updating testimonial: ' + (err.error?.message || err.message), 'Error');
      }
    });
  }

  /** Add or Update */
  saveTestimonial() {
    if (!this.testimonialForm.valid) {
      this.toastr.error('Please fill all required fields correctly.', 'Validation Error');
      return;
    }

    const data = { ...this.testimonialForm.value };

    if (this.isUpdate) {
      this.updateTestimonial(data);
    } else {
      this.addTestimonial(data);
    }
  }

  addTestimonial(data: any) {
    this.commonService.addTestimonial(data).subscribe({
      next: (res) => {
        this.toastr.success('Testimonial added successfully.');
        this.loadAllTestimonials();
        this.isOpen = false;
      },
      error: (err) => {
        this.toastr.error('Failed to add testimonial: ' + (err.error?.message || err.message), 'Error');
      }
    });
  }

  /** Edit testimonial */
  editTestimonial(data: any) {
    this.isUpdate = true;
    this.isOpen = true;
    this.testimonialModel = { ...data };

    this.rating = data.rating;

    this.testimonialForm.patchValue({
      name: data.name,
      message: data.message,
      rating: data.rating,
      isactive: data.isactive,
    });
  }


  /** Update testimonial */
  updateTestimonial(data: any) {
    this.commonService.updateTestimonial({ ...data, id: this.testimonialModel.id }).subscribe({
      next: (res) => {
        this.toastr.success('Testimonial updated successfully.');
        this.loadAllTestimonials();
        this.isOpen = false;
        this.isUpdate = false;
      },
      error: (err) => {
        this.toastr.error('Error updating testimonial: ' + (err.error?.message || err.message), 'Error');
      }
    });
    this.isOpen = false;
    this.isUpdate = false;
  }

  /** Delete testimonial */
  deleteTestimonial(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this testimonial?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commonService.deleteTestimonial(id).subscribe({
          next: () => {
            this.toastr.success('Testimonial deleted successfully.');
            this.loadAllTestimonials();
          },
          error: (err) => {
            this.toastr.error('Error deleting testimonial: ' + (err.error?.message || err.message), 'Error');
          }
        });
        this.loadAllTestimonials();
      }
    });
  }

  /** View testimonial modal (future use) */
  openTestimonialView(data: any, modalRef: any) {
    this.viewTestimonial = { ...data };
    this.modalService.open(modalRef, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true,
    });
  }
}
