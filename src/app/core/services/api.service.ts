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
  //authenticate

  public static uploadClientLogoImagesURL: string = ApiService.HOST_URL + '/keryar/UploadClientLogoImages';
  public static saveClientDetailsURL: string = ApiService.HOST_URL + '/keryar/SaveClientDetails';
  public static getAllClientsDataURL: string = ApiService.HOST_URL + '/keryar/GetAllClients';
  public static removeClientDetailsByIdURL: string = ApiService.HOST_URL + '/keryar/RemoveClientDetailsById/';
  public static updateClientActiveDeactiveURL: string = ApiService.HOST_URL + '/keryar/UpdateClientActiveDeactive';
  public static deleteUploadedImageFromFolderURL: string = ApiService.HOST_URL + '/keryar/DeleteUploadedImageFromFolder';

}
