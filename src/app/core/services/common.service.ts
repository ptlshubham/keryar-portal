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

    // testimonials
    //get all testimonial
    getAllTestimonials() {
        return this.httpClient.get<any>(ApiService.getAllTestimonialsURL);
    }
    //get all test Testimonials by id
    getTestimonialById(id: any) {
        return this.httpClient.get<any>(`${ApiService.getTestimonialByIdURL}${id}`);
    }

    // add testimonial
    addTestimonial(data: any) {
        return this.httpClient.post<any>(ApiService.addTestimonialURL, data);
    }

    // update testimonial by id
    updateTestimonial(data: any) {
        return this.httpClient.post<any>(ApiService.updateTestimonialURL, data);
    }

    // delete Testimonials
    deleteTestimonial(id: any) {
        return this.httpClient.delete(`${ApiService.deleteTestimonialURL}${id}`)
    }
}