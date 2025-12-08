import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ConnectService {
    constructor(
        private httpClient: HttpClient
    ) { }

    getInternshipFormDetails() {
        return this.httpClient.get(ApiService.getInternshipFormDetailsURL);
    }
    removeInternshipDetails(id: any) {
        return this.httpClient.get(ApiService.removeInternshipDetailsURL + id);
    }

    getContactusFormDetails() {
        return this.httpClient.get(ApiService.getContactusFormDetailsURL);
    }
    removeContactusFormDetails(id: any) {
        return this.httpClient.get(ApiService.removeContactusFormDetailsURL + id);
    }
    sendInternshipLink(data: any): Observable<any> {
        return this.httpClient.post(ApiService.sendInternshipLinkURL, data);
    }

    updateInternshipAutoApproved(data: any): Observable<any> {
        return this.httpClient.post(ApiService.updateInternshipAutoApprovedURL, data);
    }

    getAutoApprovedInternships() {
        return this.httpClient.get(ApiService.getAutoApprovedInternshipsURL);
    }

    getAllCallToActionData(page: any = 1, limit: any = 10) {
        return this.httpClient.get(`${ApiService.getAllCallToActionDataURL}?page=${page}&limit=${limit}`);
    }

    removeCallToActionById(id: any) {
        return this.httpClient.get(ApiService.removeCallToActionByIdURL + id);
    }

    generateOfferLetter(data: any): Observable<any> {
        return this.httpClient.post(ApiService.generateAndSendSingleOfferLetterURL, data);
    }

    generateCertificate(data: any): Observable<any> {
        return this.httpClient.post(ApiService.generateAndSendSingleCertificateURL, data);
    }
}