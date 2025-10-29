import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CommonSevice {
    constructor(
        private httpClient: HttpClient
    ) { }

    /**
     * Get all student form details
     */
    getStudentFormDetails(): Observable<any> {
        return this.httpClient.get<any>(ApiService.getStudentFormDetailsURL);
    }

    /**
     * Remove a student form by id — uses HTTP DELETE to match backend route
     */
    removeStudentFormDetailsById(id: any): Observable<any> {
        return this.httpClient.delete<any>(`${ApiService.removeStudentFormDetailsByIdURL}${id}`);
    }

}