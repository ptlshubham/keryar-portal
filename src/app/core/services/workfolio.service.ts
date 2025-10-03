import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class WorkfolioService {
    constructor(
        private httpClient: HttpClient
    ) { }
 
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

    // Case Study Services
    uploadCaseStudyCover(data: any) {
        return this.httpClient.post(ApiService.uploadCaseStudyCoverImagesURL, data);
    }
    uploadCaseStudyMultiImage(data: any) {
        return this.httpClient.post(ApiService.uploadCaseStudyMultiImageURL, data);
    }
    saveCaseStudyData(data: any) {
        return this.httpClient.post(ApiService.saveCaseStudyDetailsURL, data);
    }
    getAllCaseStudyData() {
        return this.httpClient.get(ApiService.getAllCaseStudyDataURL);
    }
    removeCaseStudyDetailsById(id: any) {
        return this.httpClient.get(ApiService.removeCaseStudyDetailsByIdURL + id);
    }
    updateCaseStudyActiveDeactive(data: any) {
        return this.httpClient.post(ApiService.updateCaseStudyActiveDeactiveURL, data);
    }


    
}