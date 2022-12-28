import { HttpHeaders, HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TBLShamelNewShateb } from '../../../models/finance_department/payrol/TBLShamelNewShateb';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelNewShatebService {

  
  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };

  constructor(private httpClient : HttpClient) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"TBLShamelNewShateb",options);  
    
  }


  GetNetCash(id:number,year_id:number,month_id:number):Observable<TBLShamelNewShateb>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<TBLShamelNewShateb>(this.RestUrl +`TBLShamelNewShateb/GetNetCash/${id}/${year_id}/${month_id}`,options);      
  }
  


  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"TBLShamelNewShateb/delete/"+id,options);  
  }

  add(obj : TBLShamelNewShateb )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/",obj,options);  
  }

  update(obj : TBLShamelNewShateb )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +`TBLShamelNewShateb/${obj.serail}`,obj,options);  
  }

  stoppedSalaries(req : any )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/StoppedSalary",req,options);  
  }

  changeSalaries(req : any )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/ChangeSalary",req,options);  
  }

  updateInsuranceSalary2Salary( monthId: number, yearId: number)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/UpdateInsuranceSalary2Salary/"+monthId+'/'+yearId,options);  
  }

  updateSalaryOld2Salary( monthId: number, yearId: number)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/UpdateSalaryOld2Salary/"+monthId+'/'+yearId,options);  
  }

  newPayrolDifference(request: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/NewPayrolDifference/",request,options);  

  }

  moveAccounter(request: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/TBLShamelEmployeeMoveAccounter/",request,options);  
  }

  stopAccounter(request: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/TBLShamelEmployeeStopAccounter/",request,options);  
  }

  newPayrolShatebStatistics(request: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelNewShateb/NewPayrolShatebStatics/",request,options);  

  }
}
