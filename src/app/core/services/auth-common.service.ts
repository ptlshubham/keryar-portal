import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthCommonService {

    constructor(private httpClient: HttpClient) { }

    /**
     * Send OTP to admin email
     */
    sendOtp(email: string): Observable<any> {
        return this.httpClient.post<any>(ApiService.sendOTPForAdminLoginURL, { email });
    }

    /**
     * Verify OTP and login
     */
    loginWithOtp(email: string, otp: string, adminId: number): Observable<any> {
        return this.httpClient.post<any>(ApiService.verifyOTPAndLoginURL, { email, otp, adminId });
    }
}
