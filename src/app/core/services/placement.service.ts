import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

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
}