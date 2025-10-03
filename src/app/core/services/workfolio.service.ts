import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class WorkfolioService {
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

    // registerRetailer(data: any) {
    //     return this.httpClient.post(ApiService.RegisterRetailerURL, data);
    // }
    // getCompanyIdFromParam(pathParam: string) {
    //     return this.httpClient.post<any>(ApiService.GetCompanyByParamURL, { pathParam });
    // }

    // SaveRetailRegistrationOtp(data: any) {
    //     return this.httpClient.post(ApiService.saveRetailRegistrationOtpURL, data);
    // }
    // saveOTPForRetailLogin(data: any) {
    //     return this.httpClient.post(ApiService.saveOTPForRetailLoginURL, data);
    // }
    // loginwithotp(email: string, otp: string, pathParam: string) {
    //     const data = {
    //         email: email,
    //         otp: otp,
    //         pathParam: pathParam  // ← pass path info to backend
    //     };
    //     return this.httpClient.post<any>(ApiService.retailerLoginWithOTPURL, data);
    // }

    // getClientDetailsById(id: any) {
    //     return this.httpClient.get(ApiService.getClientByIdForRetailURL + id);
    // }
    // getAssignedEmployee(id: any) {
    //     return this.httpClient.get(ApiService.getAssignedEmployeeClientDataURL + id);
    // }
    // updateClientDetails(data: any) {

    //     return this.httpClient.post(ApiService.updateClientDetailsForRetailURL, data);
    // }
    // signatureFileUpload(data: any) {
    //     return this.httpClient.post(ApiService.signatureFileUploadURL, data);
    // }

    // removeUploadedFile(data: any) {

    //     return this.httpClient.post(ApiService.removeUploadedFilesDetails, data);
    // }

    // getAllRetailData(): Observable<any> {
    //     return this.httpClient.get(ApiService.getAllRetailData);
    // }

    // saveOtpOldRetailRegistration(data: any) {
    //     return this.httpClient.post(ApiService.saveOTPForOldRetailRegistrationURL, data);
    // }
    // validateAndRegisterOldRetailUser(data: any) {
    //     return this.httpClient.post(ApiService.validateAndRegisterOldRetailUserURL, data);
    // }

    // getCompanyGoogleDriveTokens(companyId: string): Observable<any> {
    //     return this.httpClient.get(ApiService.getCompanyGoogleDriveTokensURL + companyId, { headers: this.getHeaders() });
    // }

    // getClientGoogleDriveFolderId(clientId: string): Observable<any> {
    //     return this.httpClient.get(ApiService.getClientGoogleDriveFolderIdURL + clientId, { headers: this.getHeaders() });
    // }
    // saveClientGeneratedToken(data: any): Observable<any> {
    //     return this.httpClient.post(ApiService.saveClientTokenURL, data);
    // }

    // getClientTokensByIdWithRange(data: any) {
    //     return this.httpClient.post(ApiService.getTicketsByClientIdWithRangeURL, data);
    // }
    // getClientTokensById(id: any) {
    //     return this.httpClient.get(ApiService.getTicketsByClientIdURL + id);
    // }



    saveClientDetails(data: any) {
        return this.httpClient.post(ApiService.saveClientDetailsURL, data);
    }

    uploadClientLogo(data: any) {
        return this.httpClient.post(ApiService.uploadClientLogoImagesURL, data);
    }

    getAllClients() {
        return this.httpClient.get(ApiService.getAllClientsDataURL);
    }
    removeClientDetailsById(id: any) {
        return this.httpClient.get(ApiService.removeClientDetailsByIdURL + id);
    }
    updateClientActiveDeactive(data: any) {
        return this.httpClient.post(ApiService.updateClientActiveDeactiveURL, data);
    }
    deleteUploadedImageFromFolder(data: any) {
        return this.httpClient.post(ApiService.deleteUploadedImageFromFolderURL, data);
    }


    // Portfolio Services
    uploadPortfolioCover(data: any) {
        return this.httpClient.post(ApiService.uploadPortfolioCoverImagesURL, data);
    }
    uploadPortfolioMultiImage(data: any) {
        return this.httpClient.post(ApiService.uploadPortfolioMultiImageURL, data);
    }
    savePortfolioData(data: any) {
        debugger
        return this.httpClient.post(ApiService.savePortfolioDetailsURL, data);
    }
    getAllPortfolioData() {
        return this.httpClient.get(ApiService.getAllPortfolioDataURL);
    }
    removePortfolioDetailsById(id: any) {
        return this.httpClient.get(ApiService.removePortfolioDetailsByIdURL + id);
    }


    
}