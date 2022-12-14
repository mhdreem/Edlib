import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TblShamelNewPayrolAdd } from '../../../models/finance_department/payrol/TblShamelNewPayrolAdd';
import { TblShamelNewPayrolAddRequest } from '../../../models/finance_department/payrol/tblShamelNewPayrolAddRequest';
import { TblShamelNewPayrolTax } from '../../../models/finance_department/payrol/TblShamelNewPayrolTax';

@Injectable({
  providedIn: 'root'
})
export class TblShamelNewPayrolAddService {

  
  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  getById(id: number) :Observable<TblShamelNewPayrolAdd>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<TblShamelNewPayrolAdd>(this.RestUrl +"TblShamelNewPayrolAdd/GetByID/"+id,options) as Observable<TblShamelNewPayrolAdd>;  
    
  }

  update(obj : TblShamelNewPayrolAddRequest )  {
    console.log("res4");
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +`TblShamelNewPayrolAdd/${obj.id}`,obj,options);  
  }

  Save(obj : TblShamelNewPayrolAddRequest,month_id:number,year_id:number )  {
    console.log("res4");
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +`TblShamelNewPayrolAdd/Save/${month_id}/${year_id}`,obj,options);  
  }

  

  add(obj : TblShamelNewPayrolAddRequest )  {
    console.log("res4");
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +`TblShamelNewPayrolAdd/`,obj,options);  
  }
  
}
