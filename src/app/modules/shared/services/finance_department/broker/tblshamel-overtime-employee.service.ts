import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { elementAt, Observable } from 'rxjs';
import { TBLShamelBonusReason } from '../../../models/employees_department/TBLShamelBonusReason';
import { TBLShamelOvertimeEmployee } from '../../../models/finance_department/broker/TBLShamelOvertimeEmployee';
import { TBLShamelOverTimeShatebService } from './tblshamel-overtime-shateb.service';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelOvertimeEmployeeService {
  private RestUrl = 'https://localhost:44335/api/TBLShamelOverTimeEmployee';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
 constructor(private httpClient : HttpClient) { }
  
    list()  {     
      return this.httpClient.get<TBLShamelOvertimeEmployee[]>(this.RestUrl ,this.httpOptions);        
    }
    

    EmployeeFullName(searchName:string)  {     
      return this.httpClient.get<TBLShamelOvertimeEmployee[]>(  `${this.RestUrl}\\EmployeeFullName\\${searchName}`);        
    }


    listName(name:string)  {     
      return this.httpClient.get<TBLShamelOvertimeEmployee[]>(  `${this.RestUrl}\\ListBrokerName\\${name}`,this.httpOptions);        
    }


    Search(searchRequest : any)  {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {  headers: headers };  
      console.log("111");
      return this.httpClient.post<{Item1: TBLShamelOvertimeEmployee[], Item2: number}>(this.RestUrl +`/Search/`,searchRequest,this.httpOptions) as Observable<{Item1: TBLShamelOvertimeEmployee[], Item2: number}>;  
      
    }

    CanDelete(serail:number)  {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {  headers: headers };  
      return this.httpClient.get<boolean>(this.RestUrl+`/CanDelete/${serail}` ,this.httpOptions);  
      
    }

    isUniqueRecord(emp : TBLShamelOvertimeEmployee)  {
      return this.httpClient.post<TBLShamelOvertimeEmployee[]>(this.RestUrl +`/isUniqueRecord`,emp);        
    }

    SearchById(serail:number)  {
      return this.httpClient.get<TBLShamelOvertimeEmployee[]>(this.RestUrl +`/SearchById/${serail}`);        
    }
  
  
    delete(id:number )  {
      return this.httpClient.delete<number>(this.RestUrl+`/${id}` ,this.httpOptions);  
    }
  
    add(obj : TBLShamelOvertimeEmployee )  {
      console.log('add', obj);
      return this.httpClient.post<number>(this.RestUrl ,obj,this.httpOptions);  
    }
  
    update(obj : TBLShamelOvertimeEmployee )  {
      console.log('update', obj);
      return this.httpClient.put<number>(this.RestUrl ,obj);  
    }

    Validate_Name(Fname:string,LName:string,Serail:number)
    {
     
      let request =
    {
      fname:Fname,
      lname:LName,
      serial:Serail
    };
      return this.httpClient.post<TBLShamelOvertimeEmployee[]>(this.RestUrl+`/Validate_Name` ,request,this.httpOptions);  

    }
  
  }
  