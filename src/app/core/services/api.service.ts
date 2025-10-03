import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static HOST_URL: string = "http://localhost:8300";
  // public static HOST_URL: string = "https://api.fosterx.co";


  constructor() {
  }

  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Client Details APIs
  public static uploadClientLogoImagesURL: string = ApiService.HOST_URL + '/keryar/UploadClientLogoImages';
  public static saveClientDetailsURL: string = ApiService.HOST_URL + '/keryar/SaveClientDetails';
  public static getAllClientsDataURL: string = ApiService.HOST_URL + '/keryar/GetAllClients';
  public static removeClientDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveClientDetailsById/';
  public static updateClientActiveDeactiveURL: string = ApiService.HOST_URL + '/keryar/UpdateClientActiveDeactive';
  public static deleteUploadedImageFromFolderURL: string = ApiService.HOST_URL + '/keryar/DeleteUploadedImageFromFolder';

  // Portfolio Details APIs 

  public static uploadPortfolioCoverImagesURL: string = ApiService.HOST_URL + '/keryar/UploadPortfolioCoverImages';
  public static uploadPortfolioMultiImageURL: string = ApiService.HOST_URL + '/keryar/UploadPortfolioMultiImage';
  public static savePortfolioDetailsURL: string = ApiService.HOST_URL + '/keryar/SavePortfolioDetails';
  public static getAllPortfolioDataURL: string = ApiService.HOST_URL + '/keryar/GetAllPortfolioDetails';
  public static removePortfolioDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemovePortfolioDetailsById/'
  public static updatePortfolioDetailsURL: string = ApiService.HOST_URL + '/keryar/UpdatePortfolioDetails';

  // Case Study Details APIs 

  public static uploadCaseStudyCoverImagesURL: string = ApiService.HOST_URL + '/keryar/UploadCaseStudyCoverImages';
  public static uploadCaseStudyMultiImageURL: string = ApiService.HOST_URL + '/keryar/UploadCaseStudyMultiImage';
  public static saveCaseStudyDetailsURL: string = ApiService.HOST_URL + '/keryar/SaveCaseStudyDetails';
  public static getAllCaseStudyDataURL: string = ApiService.HOST_URL + '/keryar/GetAllCaseStudyDetails';
  public static removeCaseStudyDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveCaseStudyDetailsById/';
  public static updateCaseStudyActiveDeactiveURL: string = ApiService.HOST_URL + '/keryar/UpdateCaseStudyActiveDeactive';
  public static updateCaseStudyDetailsURL: string = ApiService.HOST_URL + '/keryar/UpdateCaseStudyDetails';
  // placement
  public static savePlacementCategoryURL: string = ApiService.HOST_URL + '/keryar/SavePlacementCategory';
  public static getAllPlacementCategoryURL: string = ApiService.HOST_URL + '/keryar/GetAllPlacementCategory';
  public static getAllActivePlacementCategoryURL: string = ApiService.HOST_URL + '/keryar/GetAllActivePlacementCategory';
  public static updateCategoryStatusURL: string = ApiService.HOST_URL + '/keryar/UpdateCategoryStatus';
  public static removePlacementCategoryURL: string = ApiService.HOST_URL + '/keryar/RemovePlacementCategory/';

  // sub
  public static saveSubCategoryURL: string = ApiService.HOST_URL + '/keryar/SaveSubCategory';
  public static getAllSubCategoryURL: string = ApiService.HOST_URL + '/keryar/GetAllSubCategory';
  public static getAllActiveSubCategoryURL: string = ApiService.HOST_URL + '/keryar/GetAllActiveSubCategory';
  public static updateSubCategoryStatusURL: string = ApiService.HOST_URL + '/keryar/UpdateSubCategoryStatus';
  public static removeSubCategoryURL: string = ApiService.HOST_URL + '/keryar/RemoveSubCategory/';

  // subtosub
  public static saveSubToSubCategoryURL: string = ApiService.HOST_URL + '/keryar/SaveSubToSubCategory';
  public static getAllSubToSubCategoryURL: string = ApiService.HOST_URL + '/keryar/GetAllSubToSubCategory';
  public static getAllActiveSubToSubCategoryURL: string = ApiService.HOST_URL + '/keryar/GetAllActiveSubToSubCategory';
  public static updateSubToSubCategoryStatusURL: string = ApiService.HOST_URL + '/keryar/UpdateSubToSubCategoryStatus';
  public static removeSubToSubCategoryURL: string = ApiService.HOST_URL + '/keryar/RemoveSubToSubCategory/';


  // quetions
  public static saveSelfAssessmentQuestionSetURL: string = ApiService.HOST_URL + '/keryar/SaveSelfAssessmentQuestionSet';
  public static getAllSelfQuestionSetDetailsURL: string = ApiService.HOST_URL + '/keryar/GetAllSelfQuestionSetDetails';
  public static updateSelfAssessmentQuestionSetURL: string = ApiService.HOST_URL + '/keryar/UpdateSelfAssessmentQuestionSet';
  public static removeSelfAssessmentQuestionSetURL: string = ApiService.HOST_URL + '/keryar/RemoveSelfAssessmentQuestionSet/';


  // job Openings
  public static saveJobOpeningDetailsURL: string = ApiService.HOST_URL + '/keryar/SaveJobOpeningDetails';
  public static getAllJobOpeningsURL: string = ApiService.HOST_URL + '/keryar/GetAllJobOpenings';
  public static updateJobOpeningActiveDeactiveURL: string = ApiService.HOST_URL + '/keryar/UpdateJobOpeningActiveDeactive';
  public static updateJobOpeningURL: string = ApiService.HOST_URL + '/keryar/UpdateJobOpening';
  public static deleteJobOpeningURL: string = ApiService.HOST_URL + '/keryar/DeleteJobOpening';
  public static uploadJobOpeningImgURL: string = ApiService.HOST_URL + '/keryar/UploadJobOpeningImg';


  // connect
  public static getInternshipFormDetailsURL: string = ApiService.HOST_URL + '/keryar/GetinternshipFormDetails';
  public static removeInternshipDetailsURL: string = ApiService.HOST_URL + '/keryar/RemoveInternshipdetails/';

  public static getContactusFormDetailsURL: string = ApiService.HOST_URL + '/keryar/GetContactusFormDetails/';
  public static removeContactusFormDetailsURL: string = ApiService.HOST_URL + '/keryar/RemoveContactusFormdetails/';


}
