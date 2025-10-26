import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CareerService {
    constructor(
        private httpClient: HttpClient
    ) { }

    // Helper method to get headers with token
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token'); // Adjust key if different
        return new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });
    }
    saveJobOpeningDetails(data: any) {
        return this.httpClient.post(ApiService.saveJobOpeningDetailsURL, data);
    }
    getAllJobOpenings() {
        return this.httpClient.get(ApiService.getAllJobOpeningsURL);
    }
    updateJobOpeningActiveDeactive(data: any): Observable<any> {
        return this.httpClient.post(ApiService.updateJobOpeningActiveDeactiveURL, data);
    }

    updateJobOpening(data: any): Observable<any> {
        return this.httpClient.post(ApiService.updateJobOpeningURL, data);
    }

    deleteJobOpening(id: any): Observable<any> {
        return this.httpClient.get(ApiService.deleteJobOpeningURL + id);
    }

    uploadJobOpeningImg(data: any) {
        return this.httpClient.post(ApiService.uploadJobOpeningImgURL, data);
    }
    getCareerApplications() {
        return this.httpClient.get(ApiService.getCareerApplicationsURL);
    }
    getCareerApplicationsByJob(id: string): Observable<any> {
        return this.httpClient.get(ApiService.getCareerApplicationsByJobURL + id);
    }
    deleteCareerApplication(id: string): Observable<any> {
        return this.httpClient.get(ApiService.deleteCareerApplicationURL + id);
    }


    getAllCareerAssessments(status?: string): Observable<any> {
        let url = `${ApiService.HOST_URL}/keryar/GetAllCareerAssessments`;
        if (status) {
            url += `?status=${status}`;
        }
        return this.httpClient.get(url);
    }

    // Get career assessment preview
    getCareerAssessmentPreview(assessmentId: string): Observable<any> {
        return this.httpClient.get(`${ApiService.HOST_URL}/keryar/GetCareerAssessmentPreview/${assessmentId}`);
    }

    // Approve/Reject career assessment
    approveRejectCareerAssessment(assessmentId: string, status: string): Observable<any> {
        return this.httpClient.post(`${ApiService.HOST_URL}/keryar/ApproveRejectCareerAssessment`, {
            assessmentId,
            status
        });
    }

    // Update career answer correctness
    updateCareerAnswerCorrectness(careerFormId: string, questionSetId: string, questionId: string, isCorrect: number): Observable<any> {
        return this.httpClient.post(`${ApiService.HOST_URL}/keryar/UpdateCareerAnswerCorrectness`, {
            careerFormId,
            questionSetId,
            questionId,
            isCorrect
        });
    }

    // Get approved career students
    getApprovedCareerStudents(): Observable<any> {
        return this.httpClient.get(`${ApiService.HOST_URL}/keryar/GetApprovedCareerStudents`);
    }

    // Update career interview status
    updateCareerInterviewStatus(data: { id: string, interviewround: string }): Observable<any> {
        return this.httpClient.post(`${ApiService.HOST_URL}/keryar/UpdateCareerInterviewStatus`, data);
    }

    // Remove career interview student
    removeCareerInterviewStudent(id: string): Observable<any> {
        return this.httpClient.post(`${ApiService.HOST_URL}/keryar/RemoveCareerInterviewStudent`, { id });
    }

    // Update career remarks
    updateCareerRemarks(assessmentId: string, remarks: string): Observable<any> {
        return this.httpClient.post(`${ApiService.HOST_URL}/keryar/UpdateCareerRemarks`, {
            assessmentId,
            remarks
        });
    }

    // Remove career assessment
    removeCareerAssessment(assessmentId: string): Observable<any> {
        return this.httpClient.delete(`${ApiService.HOST_URL}/keryar/RemoveCareerAssessment/${assessmentId}`);
    }
}