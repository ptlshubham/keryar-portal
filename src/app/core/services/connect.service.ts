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

}