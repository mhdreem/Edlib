import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TblshamelTaskService {
  private RestUrl = 'https://localhost:44335/api/';

  constructor(private httpClient : HttpClient) { }

  getStatus(userId: number)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"TBLShamelTask/"+userId,options);  
    
  }
}
