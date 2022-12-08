import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaging } from '../../models/employees_department/ipaging';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStatsService {


  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  Stats1(request:any): Observable<IPaging>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats1",request,options) as Observable<IPaging>;      
  }

  Stats2(request:any): Observable<IPaging>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats2",request,options) as Observable<IPaging>;      
  }

  Stats3()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats3",options);      
  }

  Stats4(request:any): Observable<IPaging>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/Stats4",request,options) as Observable<IPaging>;      
  }

  NumEmployeeDependenceOnMalak() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/NumEmployeeDependenceOnMalak",options);      
  }

  NumEmployeeDependenceOnClass() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/NumEmployeeDependenceOnClass",options);      
  }

  NumEmployeeDependenceOnGender() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelEmployeeStats/NumEmployeeDependenceOnGender",options);      
  }

  
}
