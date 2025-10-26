import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CareerService } from 'src/app/core/services/career.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-approved-career-person',
  templateUrl: './approved-career-person.component.html',
  styleUrl: './approved-career-person.component.scss'
})
export class ApprovedCareerPersonComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  persons: any[] = [];
  paginateData: any[] = [];
  filteredPersons: any[] = [];
  selectedPerson: any | null = null;
  searchTerm: string = '';
  selectedDate: string = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  isLoadingPreview = false;
  private modalRef?: NgbModalRef;
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
      { label: 'Approved Career Persons', active: true }
    ];
    this.loadApprovedPersons();
  }

  loadApprovedPersons() {
    this.careerService.getApprovedCareerStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.persons = response.data
            .filter((item: any) => item.interviewround === 'hired')
            .map((item: any, index: number) => ({
              ...item,
              index: index + 1,
              calculated_marks: item.obtained_marks ?? 0,
              total_marks: item.total_marks ?? 0
            }));
          this.applyFilters();
        } else {
          this.toastr.error(response.message || 'Failed to fetch approved persons');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching persons: ' + (err.error?.message || err.message));
      }
    });
  }

  applyFilters() {
    let filteredPersons = [...this.persons];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredPersons = filteredPersons.filter(person =>
        person.career.name.toLowerCase().includes(searchLower) ||
        person.career.email.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedDate) {
      const selected = new Date(this.selectedDate);
      const selectedDateStr = selected.toISOString().split('T')[0];
      filteredPersons = filteredPersons.filter(person => {
        const personDate = new Date(person.createddate);
        const personDateStr = personDate.toISOString().split('T')[0];
        return personDateStr === selectedDateStr;
      });
    }

    this.filteredPersons = filteredPersons;
    this.collectionSize = filteredPersons.length;
    this.getPagination();
  }

  getPagination() {
    this.paginateData = this.filteredPersons.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  onDateChange() {
    this.page = 1;
    this.applyFilters();
  }

  openPreviewModal(modal: any, person: any) {
    this.isLoadingPreview = true;
    this.selectedPerson = null;
    this.safeResumeUrl = undefined;

    this.careerService.getCareerAssessmentPreview(person.assessment_id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.selectedPerson = {
            ...person,
            ...response.data,
            answers: response.data.answers || [],
            calculated_marks: person.calculated_marks ?? response.data.obtained_marks ?? 0,
            total_marks: response.data.total_marks ?? person.total_marks ?? 0
          };

          const resumeUrl: string | null =
            this.selectedPerson?.career?.resume && typeof this.selectedPerson.career.resume === 'string'
              ? this.selectedPerson.career.resume
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
            this.selectedPerson.career.resume = fullResumeUrl;
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
      },
      complete: () => {
        this.isLoadingPreview = false;
      }
    });
  }

  closeModal() {
    this.modalRef?.close();
    this.selectedPerson = null;
    this.isLoadingPreview = false;
    this.safeResumeUrl = undefined;
  }

  trackById(_: number, item: any) {
    return item.assessment_id;
  }

  // Option selection helpers (copy from career-result if needed)
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