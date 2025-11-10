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

  // Authentication APIs
  public static sendOTPForAdminLoginURL: string = ApiService.HOST_URL + '/keryar/SendOTPForAdminLogin';
  public static verifyOTPAndLoginURL: string = ApiService.HOST_URL + '/keryar/VerifyOTPAndLogin';

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

  // Blog Details APIs
  public static uploadBlogCoverImagesURL: string = ApiService.HOST_URL + '/keryar/UploadBlogCoverImages';
  public static uploadBlogMultiImageURL: string = ApiService.HOST_URL + '/keryar/UploadBlogMultiImage';
  public static saveBlogDetailsURL: string = ApiService.HOST_URL + '/keryar/SaveBlogDetails';
  public static getAllBlogDataURL: string = ApiService.HOST_URL + '/keryar/GetAllBlogDetails';
  public static removeBlogDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveBlogDetailsById/';
  public static updateBlogActiveDeactiveURL: string = ApiService.HOST_URL + '/keryar/UpdateBlogActiveDeactive';
  public static updateBlogDetailsURL: string = ApiService.HOST_URL + '/keryar/UpdateBlogDetails';

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
  public static deleteJobOpeningURL: string = ApiService.HOST_URL + '/keryar/DeleteJobOpening/';
  public static uploadJobOpeningImgURL: string = ApiService.HOST_URL + '/keryar/UploadJobOpeningImg';


  // connect
  public static getInternshipFormDetailsURL: string = ApiService.HOST_URL + '/keryar/GetinternshipFormDetails';
  public static getsendInternshipTestLinkDetailsURL: string = ApiService.HOST_URL + '/keryar/GetsendInternshipTestLinkDetails';

  public static removeInternshipDetailsURL: string = ApiService.HOST_URL + '/keryar/RemoveInternshipdetails/';

  public static getContactusFormDetailsURL: string = ApiService.HOST_URL + '/keryar/GetContactusFormDetails/';
  public static removeContactusFormDetailsURL: string = ApiService.HOST_URL + '/keryar/RemoveContactusFormdetails/';


  // placement - form
  public static getAllPlacementFormsURL: string = ApiService.HOST_URL + '/keryar/GetAllPlacementForms';
  public static getPlacementFormByIdURL: string = ApiService.HOST_URL + '/keryar/GetPlacementFormById/';
  public static removePlacementFormByIdURL: string = ApiService.HOST_URL + '/keryar/RemovePlacementFormById/';


  public static getAllStudentAssessmentsURL: string = ApiService.HOST_URL + '/keryar/GetAllStudentAssessments';
  public static approveRejectAssessmentURL: string = ApiService.HOST_URL + '/keryar/ApproveRejectAssessment';
  public static getAssessmentPreviewURL: string = ApiService.HOST_URL + '/keryar/GetAssessmentPreview';

  // college
  public static saveCollegeDetailsURL: string = ApiService.HOST_URL + '/keryar/SaveCollegeDetails';
  public static getAllCollegesDataURL: string = ApiService.HOST_URL + '/keryar/GetAllColleges';
  public static removeCollegeDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveCollegeDetailsById/';
  public static updateCollegeActiveDeactiveURL: string = ApiService.HOST_URL + '/keryar/UpdateCollegeActiveDeactive';


  public static saveCollegeJobMappingURL: string = ApiService.HOST_URL + '/keryar/SaveCollegeJobMapping';
  public static getAllCollegeJobMappingsURL: string = ApiService.HOST_URL + '/keryar/GetAllCollegeJobMappings';
  public static updateCollegeJobLinkStatusURL: string = ApiService.HOST_URL + '/keryar/UpdateCollegeJobLinkStatus';
  public static deleteCollegeJobMappingURL: string = ApiService.HOST_URL + '/keryar/DeleteCollegeJobMapping';
  public static getJobOpeningsByCollegeURL: string = ApiService.HOST_URL + '/keryar/GetJobOpeningsByCollege/';
  public static getCollegeByLinkTokenURL: string = ApiService.HOST_URL + '/keryar/GetCollegeByLinkToken/';


  public static updateAnswerCorrectnessURL: string = ApiService.HOST_URL + '/keryar/UpdateAnswerCorrectness';


  // interviw Round
  public static getApprovedStudentsURL: string = `${ApiService.HOST_URL}/keryar/GetApprovedStudents`;
  public static updateInterviewStatusURL: string = `${ApiService.HOST_URL}/keryar/UpdateInterviewStatus`;
  public static removeInterviewStudentURL: string = `${ApiService.HOST_URL}/keryar/RemoveInterviewStudent`;


  public static updateRemarksURL: string = ApiService.HOST_URL + '/keryar/UpdateRemarks';
  public static sendInternshipLinkURL: string = ApiService.HOST_URL + '/keryar/sendInternshipLink';

  // internship assessment
  public static getAllInternshipAssessmentsURL: string = ApiService.HOST_URL + '/keryar/GetAllInternshipAssessments';
  public static getInternshipAssessmentPreviewURL: string = ApiService.HOST_URL + '/keryar/GetInternshipAssessmentPreview';
  public static approveRejectInternshipAssessmentURL: string = ApiService.HOST_URL + '/keryar/ApproveRejectInternshipAssessment';
  public static removeInternshipAssessmentURL: string = ApiService.HOST_URL + '/keryar/RemoveInternshipAssessment/';
  // Add this to your ApiService class
  public static updateInternshipAnswerCorrectnessURL: string = ApiService.HOST_URL + '/keryar/UpdateInternshipAnswerCorrectness';

  // NEW: endpoint to update internship assessment status (replace path if your backend uses a different route)
  public static updateInternshipAssessmentStatusURL: string = ApiService.HOST_URL + '/keryar/UpdateInternshipAssessmentStatus';

  // internship interview round
  public static getApprovedInternshipStudentsURL: string = `${ApiService.HOST_URL}/keryar/GetApprovedInternshipStudents`;
  public static getRejectedInternshipStudentsURL: string = `${ApiService.HOST_URL}/keryar/GetRejectedInternshipStudents`;
  public static getHoldInternshipStudentsURL: string = `${ApiService.HOST_URL}/keryar/GetHoldInternshipStudents`;

  public static updateInternshipInterviewStatusURL: string = `${ApiService.HOST_URL}/keryar/UpdateInternshipInterviewStatus`;
  public static removeInternshipInterviewStudentURL: string = `${ApiService.HOST_URL}/keryar/RemoveInternshipInterviewStudent`;
  public static updateInternshipRemarksURL: string = ApiService.HOST_URL + '/keryar/UpdateInternshipRemarks';

  public static getAllCallToActionDataURL: string = ApiService.HOST_URL + '/keryar/GetAllCallToAction';
  public static removeCallToActionByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveCallToActionById/';
  public static getCareerApplicationsURL: string = ApiService.HOST_URL + '/keryar/GetCareerApplications';
  public static getCareerApplicationsByJobURL: string = ApiService.HOST_URL + '/keryar/GetCareerApplicationsByJob/';
  public static deleteCareerApplicationURL: string = ApiService.HOST_URL + '/keryar/DeleteCareerApplication/';

  public static getStudentFormDetailsURL: string = ApiService.HOST_URL + '/keryar/GetAllStudentFormDetails';
  public static removeStudentFormDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveStudentFormById/';


}
