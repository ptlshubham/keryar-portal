import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { WorkfolioService } from 'src/app/core/services/workfolio.service';
import { CommonSevice } from 'src/app/core/services/common.service';
import { ConnectService } from 'src/app/core/services/connect.service';
import { PlacementService } from 'src/app/core/services/placement.service';
import { CareerService } from 'src/app/core/services/career.service';

import { ChartType } from './dashboard.model';
import { InternshipService } from 'src/app/core/services/internship.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
/**
 *  Dashboard Component
 */
export class DashboardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  title!: string;
  dataSource!: Object;
  portfolioOverview: ChartType={
      chart: {
        width: 227,
        height: 227,
        type: 'pie',
      },
      colors: ["#a8aada", "#777aca", "#54a8c7"],
      legend: { show: !1 },
      stroke: {
        width: 0,
      },
      series: [],
      labels: [],
    };
  devlopmentOverview: ChartType = {
      chart: {
        width: 227,
        height: 227,
        type: 'pie',
      },
      colors: ["#777aca", "#54a8c7", "#a8aada"],
      legend: { show: false },
      stroke: { width: 0 },
      series: [],
      labels: [],
    };
  clientsCount: any;
  portfolioCount: any;
  studentFormCount: any;
  caseStudyCount: any;
  blogCount: any;
  contactUsCount: any;
  inquiryCount: any;
  QSCategoryCount: any;
  allSelfQuestionSetCount: any;
  QSCollegesCount: any;
  jobOpeningCount: any;
  studentAssessmentsCount: any;
  interviewRoundCount: any;
  hiredStudentsCount: any;
  intershipFormCount: any;
  internshipResultCount: any;
  paidStudentInternshipCount: any;
  freeStudentInternshipCount: any;
  holdStudentsCount: any;
  jobApplicationCount: any;
  careerResultCount: any;
  careerInterviewRoundCount: any;
  hiredCandidateCount: any;

  num: number = 0;

  constructor(
    public workfolioService: WorkfolioService,
    public commonService: CommonSevice,
    public connectService: ConnectService,
    public placementService: PlacementService,
    public careerService: CareerService,
    public internshipService: InternshipService
  ) {}

  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Dashboard', active: true },
    ];

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  //for student for remove duplicate entry
  removeDuplicatesByEmail(data: any[]): any[] {
    const emailMap = new Map();
    const duplicatesRemoved: any[] = [];
    let duplicateCount = 0;

    data.forEach((student: any) => {
      const email = student.email?.toLowerCase().trim();

      if (!email) {
        // Keep entries without email
        duplicatesRemoved.push(student);
        return;
      }

      if (!emailMap.has(email)) {
        // First occurrence of this email - keep it
        emailMap.set(email, true);
        duplicatesRemoved.push(student);
      } else {
        // Duplicate email found - skip this entry
        duplicateCount++;
      }
    });

    return duplicatesRemoved;
  }

  /**
   * Fetches the data
   */
  // get client
  private getAllClientsCount() {
    this.workfolioService.getAllClients().subscribe((res: any) => {
      this.clientsCount = res.length;
    });
  }
private getAllPortfolioCount() {
  this.workfolioService.getAllPortfolioData().subscribe((res: any) => {
    // Total portfolio count
    this.portfolioCount = res.length;
    const countByType = res.reduce((acc: any, item: any) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    const typeNames = Object.keys(countByType);
    const typeCounts = Object.values(countByType);

    this.portfolioOverview = {
      chart: {
        width: 227,
        height: 227,
        type: 'pie',
      },
      colors: ["#777aca", "#54a8c7", "#a8aada"],
      legend: { show: false },
      stroke: { width: 0 },
      series: typeCounts,
      labels: typeNames,
    };

    const countByDevType = res.reduce((acc: any, item: any) => {
      if (item.type === 'Development') {
        const key = item.subtype || 'Other';
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    const devTypeNames = Object.keys(countByDevType);
    const devTypeCounts = Object.values(countByDevType);

    this.devlopmentOverview = {
      chart: {
        width: 227,
        height: 227,
        type: 'pie',
      },
      colors: ["#777aca", "#54a8c7", "#a8aada"],
      legend: { show: false },
      stroke: { width: 0 },
      series: devTypeCounts,
      labels: devTypeNames,
    };
  });
}


  //get case studies
  private getAllCaseStudyCount() {
    this.workfolioService.getAllCaseStudyData().subscribe((res: any) => {
      this.caseStudyCount = res.length;
    });
  }

  // Blogs
  //get blogs counts
  private getAllBlogCount() {
    this.workfolioService.getAllBlogData().subscribe((res: any) => {
      this.blogCount = res.length;
    });
  }

  // connect
  // get Contactus Form Details
  private getContactusFormCount() {
    this.connectService.getContactusFormDetails().subscribe((res: any) => {
      this.contactUsCount = res.length;
    });
  }

  //get Inquiry count
  private getInquiryCount() {
    this.connectService.getAllCallToActionData().subscribe((res: any) => {
      this.inquiryCount = res.data.length;
    });
  }

  // question set
  //question set / category count
  private getQSCategoryCount() {
    this.placementService.getAllPlacementCategory().subscribe((res: any) => {
      this.QSCategoryCount = res.length;
    });
  }

  //get Self Question Set List
  private getAllSelfQuestionSetCount() {
    this.placementService.getAllSelfQuestionSetDetails().subscribe({
      next: (res: any) => {
        this.allSelfQuestionSetCount = res.data.length;
      },
      error: (err) => {
        this.allSelfQuestionSetCount = 0;
        console.error(err);
      },
    });
  }

  //question set / get Colleges
  private getQSCollegesCount() {
    this.placementService.getAllColleges().subscribe((res: any) => {
      this.QSCollegesCount = res.length;
    });
  }

  //get all job opening
  private getJobOpeningCount() {
    this.careerService.getAllJobOpenings().subscribe((res: any) => {
      this.jobOpeningCount = res.length;
    });
  }

  // ******campus hiring
  // Assessments review
  private getStudentAssessmentsCount() {
    this.placementService.getAllStudentAssessments().subscribe({
      next: (res) => {
        this.studentAssessmentsCount = res.data.length;
      },
      error: (err) => {
        this.studentAssessmentsCount = 0;
        console.error(err);
      },
    });
  }

  // interview-round
  private getInterviewRoundCount() {
    this.placementService.getApprovedStudents().subscribe({
      next: (res) => {
        this.interviewRoundCount = res.data.length;
      },
      error: (err) => {
        this.interviewRoundCount = 0;
        console.error(err);
      },
    });
  }

  // hired students
  private getHiredStudentsCount() {
    this.placementService.getApprovedStudents().subscribe({
      next: (response) => {
        if (response.success) {
          let students = response.data
            .filter((item: any) => item.interviewround === 'hired')
            .map((item: any, index: number) => ({
              ...item,
              index: index + 1,
              calculated_marks: item.obtained_marks ?? 0,
              total_marks: item.total_marks ?? 0,
              portfoliourl: item.portfoliourl || '',
              cover_letter: item.cover_letter || '',
            }));
          this.hiredStudentsCount = students.length;
        } else {
          this.hiredStudentsCount = 0;
        }
      },
      error: (err) => {
        console.error(err);
        this.hiredStudentsCount = 0;
      },
    });
  }

  //intership
  //get intership form details
  private getIntershipFormCount() {
    this.connectService.getInternshipFormDetails().subscribe((res: any) => {
      let data: any[] = [];
      if (!res) {
        data = [];
      } else if (Array.isArray(res)) {
        data = res;
      } else if (res.success && Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data)) {
        data = res.data;
      } else if (typeof res === 'object') {
        // Single object returned — wrap in array
        data = [res];
      }

      const internshipFormDetails = data || [];
      this.intershipFormCount = internshipFormDetails.length;
    });
  }

  // internship-result
  private getInternshipResultCount() {
    this.internshipService.getAllInternshipAssessments().subscribe({
      next: (response) => {
        if (response.success) {
          this.internshipResultCount = response.data.length;
        } else {
          this.internshipResultCount = 0;
        }
      },
      error: (err) => {
        this.internshipResultCount = 0;
        console.error(err);
      },
    });
  }

  // free-student-internship
  private getFreeStudentInternshipCount() {
    this.internshipService.getApprovedInternshipStudents().subscribe({
      next: (res) => {
        this.freeStudentInternshipCount = res.data.length;
      },
      error: (err) => {
        this.freeStudentInternshipCount = 0;
        console.error(err);
      },
    });
  }

  // paid-student-internship
  private getPaidStudentInternshipCount() {
    this.internshipService.getRejectedInternshipStudents().subscribe({
      // Use same API as result component
      next: (response) => {
        if (response.success) {
          const students = response.data
            .filter((item: any) => item.studentstatus === 'paid') // Filter by studentstatus
            .map((item: any, index: number) => ({
              ...item,
              index: index + 1,
              calculated_marks: item.obtained_marks ?? 0,
              total_marks: item.total_marks ?? 0,
            }));
          this.paidStudentInternshipCount = students.length;
        } else {
          this.paidStudentInternshipCount = 0;
        }
      },
      error: (err) => {
        this.paidStudentInternshipCount = 0;
        console.error(err);
      },
    });
  }

  // hold-students
  private getHoldStudentsCount() {
    this.internshipService.getHoldInternshipStudents().subscribe({
      next: (res) => {
        this.holdStudentsCount = res.data.length;
      },
      error: (err) => {
        this.holdStudentsCount = 0;
        console.error(err);
      },
    });
  }

  // Career
  // job-application-list
  private getJobApplicationCount() {
    this.careerService.getCareerApplications().subscribe({
      next: (res: any) => {
        this.jobApplicationCount = res.data.length;
      },
      error: (err) => {
        this.jobApplicationCount = 0;
        console.error(err);
      },
    });
  }

  // career-result
  private getCareerResultCount() {
    this.careerService.getAllCareerAssessments().subscribe({
      next: (res) => {
        this.careerResultCount = res.data.length;
      },
      error: (err) => {
        this.careerResultCount = 0;
        console.error(err);
      },
    });
  }

  //interview-round
  // careerInterviewRoundCount
  private getCareerInterviewRoundCount() {
    this.careerService.getApprovedCareerStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.careerInterviewRoundCount = response.data.length;
        } else {
          console.error(
            response.message || 'Failed to fetch approved students'
          );
        }
      },
      error: (err) => {
        console.error(
          'Error fetching students: ' + (err.error?.message || err.message)
        );
      },
    });
  }

  // hiredCandidateCount
  private getHiredCandidateCount() {
    this.careerService.getApprovedCareerStudents().subscribe({
      next: (response) => {
        if (response.success) {
          const persons = response.data
            .filter((item: any) => item.interviewround === 'hired')
            .map((item: any, index: number) => ({
              ...item,
              index: index + 1,
              calculated_marks: item.obtained_marks ?? 0,
              total_marks: item.total_marks ?? 0,
            }));
          this.hiredCandidateCount = persons.length;
        } else {
          console.error(response.message || 'Failed to fetch approved persons');
        }
      },
      error: (err) => {
        console.error(
          'Error fetching persons: ' + (err.error?.message || err.message)
        );
      },
    });
  }

  // Student form
  //get student form List
  private getStudentFormCount() {
    this.commonService.getStudentFormDetails().subscribe(
      (res: any) => {
        // Backend may return { success: true, data: [...] } or directly an array.
        const list = Array.isArray(res) ? res : res && res.data ? res.data : [];
        const originalCount = (list || []).length;
        // console.log(originalCount);

        // Remove duplicates based on email addresses
        let studentData = this.removeDuplicatesByEmail(list || []);
        const finalCount = studentData.length;
        // const duplicatesRemoved = originalCount - finalCount;
        this.studentFormCount = finalCount;
      },
      (err: any) => {
        this.studentFormCount = 0;
        console.error('Error fetching student forms:', err);
      }
    );
  }

  private fetchData() {

    //  get data for KPI
    this.getAllClientsCount();
    this.getAllPortfolioCount();
    this.getStudentFormCount();
    this.getIntershipFormCount();
    this.getAllCaseStudyCount();
    this.getAllBlogCount();
    this.getHiredStudentsCount();
    this.getHiredCandidateCount();
  }
}
