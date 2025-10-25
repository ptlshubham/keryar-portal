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
}