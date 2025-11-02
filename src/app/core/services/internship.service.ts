import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InternshipService {
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


    getsendInternshipTestLinkDetails() {
        return this.httpClient.get(ApiService.getsendInternshipTestLinkDetailsURL);
    }
    // Internship Assessment APIs
    getAllInternshipAssessments(status?: string): Observable<any> {
        const params = status ? `?status=${status}` : '';
        return this.httpClient.get(`${ApiService.getAllInternshipAssessmentsURL}${params}`);
    }

    getInternshipAssessmentPreview(assessmentId: string): Observable<any> {
        return this.httpClient.get(`${ApiService.getInternshipAssessmentPreviewURL}/${assessmentId}`);
    }

    updateInternshipAssessmentStatus(assessmentId: string, status?: 'pending' | 'passed' | 'failed', studentStatus?: string): Observable<any> {
        const payload: any = { assessmentId };
        if (status !== undefined && status !== null) payload.status = status;
        // NOTE: backend expects `studentStatus` (camelCase) for updating internship type/student status
        if (studentStatus !== undefined && studentStatus !== null) payload.studentStatus = studentStatus;
        return this.httpClient.post(ApiService.updateInternshipAssessmentStatusURL, payload);
    }

    removeInternshipAssessment(id: string): Observable<any> {
        return this.httpClient.delete(ApiService.removeInternshipAssessmentURL + id);
    }
    // In your InternshipService
    updateInternshipAnswerCorrectness(internshipFormId: string, questionSetId: string, questionId: string, isCorrect: number): Observable<any> {
        return this.httpClient.post(ApiService.updateInternshipAnswerCorrectnessURL, {
            internshipFormId,
            questionSetId,
            questionId,
            isCorrect
        });
    }

    // Internship Interview Round APIs
    getApprovedInternshipStudents(status?: string): Observable<any> {
        const params = status ? `?status=${status}` : '';
        return this.httpClient.get(`${ApiService.getApprovedInternshipStudentsURL}${params}`);
    }

    updateInternshipInterviewStatus(data: { id: string; interviewround: string }): Observable<any> {
        return this.httpClient.post(ApiService.updateInternshipInterviewStatusURL, data);
    }

    removeInternshipInterviewStudent(id: string): Observable<any> {
        return this.httpClient.post(ApiService.removeInternshipInterviewStudentURL, { id });
    }

    updateInternshipRemarks(assessmentId: string, remarks: string): Observable<any> {
        return this.httpClient.post(ApiService.updateInternshipRemarksURL, { assessmentId, remarks });
    }
}