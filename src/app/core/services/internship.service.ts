import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { forkJoin, Observable } from 'rxjs';

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

    // Internship Assessment APIs
    getAllInternshipAssessments(status?: string): Observable<any> {
        const params = status ? `?status=${status}` : '';
        return this.httpClient.get(`${ApiService.getAllInternshipAssessmentsURL}${params}`);
    }

    getInternshipAssessmentPreview(assessmentId: string): Observable<any> {
        return this.httpClient.get(`${ApiService.getInternshipAssessmentPreviewURL}/${assessmentId}`);
    }

    approveRejectInternshipAssessment(assessmentId: string, status: 'approved' | 'rejected'): Observable<any> {
        return this.httpClient.post(ApiService.approveRejectInternshipAssessmentURL, { assessmentId, status });
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
    getApprovedInternshipStudents(): Observable<any> {
        return this.httpClient.get(ApiService.getApprovedInternshipStudentsURL);
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