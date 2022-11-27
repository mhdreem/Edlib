import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStatsService {


  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  Stats1(request:any)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats1",request,options);      
  }

  Stats2(request:any)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats2",request,options);      
  }

  Stats3()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats3",options);      
  }

  Stats4(request:any)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats4",request,options);      
  }
  
}
