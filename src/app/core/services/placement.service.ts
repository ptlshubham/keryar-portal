import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PlacementService {
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

    savePlacementCategoryDetails(data: any) {
        return this.httpClient.post(ApiService.savePlacementCategoryURL, data);
    }
    getAllPlacementCategory() {
        return this.httpClient.get(ApiService.getAllPlacementCategoryURL);
    }
    getAllActivePlacementCategory() {
        return this.httpClient.get(ApiService.getAllActivePlacementCategoryURL);
    }
    updateCategoryStatus(id: any, status: any) {
        return this.httpClient.post(ApiService.updateCategoryStatusURL, { id, isactive: status });
    }
    removePlacementCategory(id: any) {
        return this.httpClient.get(ApiService.removePlacementCategoryURL + id);
    }


    // sub

    saveSubCategory(payload: any): Observable<any> {
        return this.httpClient.post(ApiService.saveSubCategoryURL, payload);
    }

    getAllSubCategory(): Observable<any> {
        return this.httpClient.get(ApiService.getAllSubCategoryURL);
    }

    getAllActiveSubCategory(): Observable<any> {
        return this.httpClient.get(ApiService.getAllActiveSubCategoryURL);
    }

    updateSubCategoryStatus(id: any, status: any): Observable<any> {
        return this.httpClient.post(ApiService.updateSubCategoryStatusURL, { id, isactive: status });
    }

    removeSubCategory(id: any): Observable<any> {
        return this.httpClient.get(ApiService.removeSubCategoryURL + id);
    }


    // sub to sub

    saveSubToSubCategory(payload: any): Observable<any> {
        return this.httpClient.post(ApiService.saveSubToSubCategoryURL, payload,);
    }
    getAllSubToSubCategory(): Observable<any> {
        return this.httpClient.get(ApiService.getAllSubToSubCategoryURL, { headers: this.getHeaders() });
    }

    getAllActiveSubToSubCategory(): Observable<any> {
        return this.httpClient.get(ApiService.getAllActiveSubToSubCategoryURL, { headers: this.getHeaders() });
    }

    updateSubToSubCategoryStatus(ids: string[], status: any): Observable<any[]> {
        const observables = ids.map(id => this.httpClient.post(ApiService.updateSubToSubCategoryStatusURL, { id, isactive: status }, { headers: this.getHeaders() }));
        return forkJoin(observables);
    }

    removeSubToSubCategory(ids: string[]): Observable<any[]> {
        const observables = ids.map(id => this.httpClient.get(ApiService.removeSubToSubCategoryURL + id, { headers: this.getHeaders() }));
        return forkJoin(observables);
    }

    // quetions
    saveSelfAssessmentQuestionSetDetails(data: any): Observable<any> {
        return this.httpClient.post(ApiService.saveSelfAssessmentQuestionSetURL, data);
    }

    getAllSelfQuestionSetDetails(): Observable<any> {
        return this.httpClient.get(ApiService.getAllSelfQuestionSetDetailsURL);
    }

    updateSelfAssessmentQuestionSetDetails(data: any): Observable<any> {
        return this.httpClient.post(ApiService.updateSelfAssessmentQuestionSetURL, data);
    }

    removeSelfAssessmentQuestionSet(id: string): Observable<any> {
        return this.httpClient.get(`${ApiService.removeSelfAssessmentQuestionSetURL}${id}`);
    }

    // form
    getAllPlacementForms(): Observable<any> {
        return this.httpClient.get(ApiService.getAllPlacementFormsURL);
    }

    getPlacementFormById(id: string): Observable<any> {
        return this.httpClient.get(ApiService.getPlacementFormByIdURL + id);
    }
    removePlacementFormById(id: string): Observable<any> {
        return this.httpClient.delete(ApiService.removePlacementFormByIdURL + id);
    }

    getAllStudentAssessments(status?: string): Observable<any> {
        const params = status ? `?status=${status}` : '';
        return this.httpClient.get(`${ApiService.getAllStudentAssessmentsURL}${params}`);
    }

    // Approve or reject an assessment
    approveRejectAssessment(assessmentId: string, status: 'approved' | 'rejected'): Observable<any> {
        return this.httpClient.post(ApiService.approveRejectAssessmentURL, { assessmentId, status });
    }

    // Get assessment preview (for admin)
    getAssessmentPreview(assessmentId: string): Observable<any> {
        return this.httpClient.get(`${ApiService.getAssessmentPreviewURL}/${assessmentId}`);
    }

    // college
    saveCollegeDetails(data: any): Observable<any> {
        return this.httpClient.post(ApiService.saveCollegeDetailsURL, data);
    }

    getAllColleges(): Observable<any> {
        return this.httpClient.get(ApiService.getAllCollegesDataURL);
    }

    removeCollegeDetailsById(id: any): Observable<any> {
        return this.httpClient.get(ApiService.removeCollegeDetailsByIdURL + id);
    }

    updateCollegeActiveDeactive(data: any): Observable<any> {
        return this.httpClient.post(ApiService.updateCollegeActiveDeactiveURL, data);
    }
}