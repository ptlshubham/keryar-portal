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


}