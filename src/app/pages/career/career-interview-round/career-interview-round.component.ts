import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from 'src/app/core/services/career.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

enum InterviewStatus {
  Pending = 'pending',
  Hired = 'hired',
  Rejected = 'rejected'
}

@Component({
  selector: 'app-career-interview-round',
  templateUrl: './career-interview-round.component.html',
  styleUrl: './career-interview-round.component.scss'
})
export class CareerInterviewRoundComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  students: any[] = [];
  paginateData: any[] = [];
  filteredStudents: any[] = [];
  selectedStudent: any | null = null;
  filterStatus: string = '';
  searchTerm: string = '';
  selectedDate: string = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  isLoadingPreview = false;
  isHiring = false;
  isRejecting = false;
  isRemoving = false;
  isSavingRemarks = false;
  private modalRef?: NgbModalRef;
  interviewStatus = InterviewStatus;
  safeResumeUrl?: SafeResourceUrl;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private careerService: CareerService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Career Interview Round', active: true }
    ];
    this.loadApprovedStudents();
  }

  loadApprovedStudents() {
    this.careerService.getApprovedCareerStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            calculated_marks: item.obtained_marks ?? 0,
            total_marks: item.total_marks ?? 0
          }));
          this.applyFilters();
        } else {
          this.toastr.error(response.message || 'Failed to fetch approved students');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching students: ' + (err.error?.message || err.message));
      }
    });
  }

  applyFilters() {
    let filteredStudents = [...this.students];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredStudents = filteredStudents.filter(student =>
        student.career.name.toLowerCase().includes(searchLower) ||
        student.career.email.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedDate) {
      const selected = new Date(this.selectedDate);
      const selectedDateStr = selected.toISOString().split('T')[0];
      filteredStudents = filteredStudents.filter(student => {
        const studentDate = new Date(student.createddate);
        const studentDateStr = studentDate.toISOString().split('T')[0];
        return studentDateStr === selectedDateStr;
      });
    }

    if (this.filterStatus) {
      filteredStudents = filteredStudents.filter(student =>
        student.interviewround === this.filterStatus
      );
    }

    this.filteredStudents = filteredStudents;
    this.collectionSize = filteredStudents.length;
    this.getPagination();
  }

  getPagination() {
    this.paginateData = this.filteredStudents.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  filterByStatus(status: string) {
    this.filterStatus = status;
    this.page = 1;
    this.applyFilters();
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  onDateChange() {
    this.page = 1;
    this.applyFilters();
  }

  openPreviewModal(modal: any, student: any) {
    this.isLoadingPreview = true;
    this.selectedStudent = null;
    this.safeResumeUrl = undefined;

    this.careerService.getCareerAssessmentPreview(student.assessment_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedStudent = {
            ...student,
            ...response.data,
            answers: response.data.answers || [],
            calculated_marks: student.calculated_marks ?? response.data.obtained_marks ?? 0,
            total_marks: response.data.total_marks ?? student.total_marks ?? 0
          };

          // Handle resume URL
          const resumeUrl: string | null =
            this.selectedStudent?.career?.resume && typeof this.selectedStudent.career.resume === 'string'
              ? this.selectedStudent.career.resume
              : null;

          if (resumeUrl) {
            let fullResumeUrl: string;
            if (resumeUrl.startsWith('/')) {
              fullResumeUrl = `https://api.fosterx.co${resumeUrl}`;
            } else if (!resumeUrl.startsWith('http')) {
              fullResumeUrl = `https://api.fosterx.co/${resumeUrl}`;
            } else {
              fullResumeUrl = resumeUrl;
            }

            this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullResumeUrl);
            this.selectedStudent.career.resume = fullResumeUrl;
          }

          this.modalRef = this.modalService.open(modal, {
            size: 'xl',
            centered: true,
            scrollable: true,
            backdrop: 'static'
          });
        } else {
          this.toastr.error(response.message || 'Failed to load preview');
        }
      },
      error: (err) => {
        this.toastr.error('Error loading preview: ' + (err.error?.message || err.message));
      }
    }).add(() => {
      this.isLoadingPreview = false;
    });
  }

  closeModal() {
    this.modalRef?.close();
    this.selectedStudent = null;
    this.isLoadingPreview = false;
    this.safeResumeUrl = undefined;
  }

  saveRemarks() {
    if (!this.selectedStudent || !this.selectedStudent.assessment_id) {
      this.toastr.error('No student selected');
      return;
    }

    this.isSavingRemarks = true;
    this.careerService.updateCareerRemarks(this.selectedStudent.assessment_id, this.selectedStudent.remarks).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message || 'Remarks saved successfully');
          this.loadApprovedStudents();
        } else {
          this.toastr.error(response.message || 'Failed to save remarks');
        }
      },
      error: (err) => {
        this.toastr.error('Error saving remarks: ' + (err.error?.message || err.message));
      },
      complete: () => {
        this.isSavingRemarks = false;
      }
    });
  }

  hireStudent(studentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to mark this student as hired for career?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, hire them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isHiring = true;
        this.careerService.updateCareerInterviewStatus({ id: studentId, interviewround: InterviewStatus.Hired }).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student marked as hired');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to mark as hired');
            }
          },
          error: (err) => {
            this.toastr.error('Error marking as hired: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isHiring = false;
          }
        });
      }
    });
  }

  rejectStudent(studentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this student for career?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRejecting = true;
        this.careerService.updateCareerInterviewStatus({ id: studentId, interviewround: InterviewStatus.Rejected }).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student marked as rejected');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to mark as rejected');
            }
          },
          error: (err) => {
            this.toastr.error('Error marking as rejected: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isRejecting = false;
          }
        });
      }
    });
  }

  removeStudent(studentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this student? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRemoving = true;
        this.careerService.removeCareerInterviewStudent(studentId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(response.message || 'Student removed successfully');
              this.loadApprovedStudents();
              this.closeModal();
            } else {
              this.toastr.error(response.message || 'Failed to remove student');
            }
          },
          error: (err) => {
            this.toastr.error('Error removing student: ' + (err.error?.message || err.message));
          },
          complete: () => {
            this.isRemoving = false;
          }
        });
      }
    });
  }

  trackById(_: number, item: any) {
    return item.assessment_id;
  }

  isOptionSelected(answer: any, optionIndex: number, optionValue: any): boolean {
    if (!answer) return false;
    if (Array.isArray(answer)) {
      return answer.includes(optionIndex) ||
        answer.includes(optionValue) ||
        answer.includes(optionIndex.toString()) ||
        answer.includes(optionValue.toString());
    }
    if (typeof answer === 'string') {
      try {
        const parsed = JSON.parse(answer);
        if (Array.isArray(parsed)) {
          return parsed.includes(optionIndex) ||
            parsed.includes(optionValue) ||
            parsed.includes(optionIndex.toString()) ||
            parsed.includes(optionValue.toString());
        }
      } catch (e) { }
    }
    return false;
  }

  isRadioSelected(answer: any, optionIndex: number, optionValue: any): boolean {
    if (answer === null || answer === undefined) return false;
    const answerStr = String(answer);
    const optionIndexStr = String(optionIndex);
    const optionValueStr = String(optionValue);
    if (typeof answer === 'string') {
      try {
        const parsed = JSON.parse(answer);
        const parsedStr = String(parsed);
        return parsedStr === optionIndexStr || parsedStr === optionValueStr;
      } catch (e) {
        return answerStr === optionIndexStr || answerStr === optionValueStr;
      }
    }
    return answerStr === optionIndexStr || answerStr === optionValueStr;
  }
}