import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TblShamelOvertimePrintTotals } from '../../../models/finance_department/broker/tbl-shamel-overtime-print-totals';
import { TBLShamelOverTimeStatistics } from '../../../models/finance_department/broker/tblshamel-over-time-statistics';
import { TBLShamelOverTimeShateb } from '../../../models/finance_department/broker/TBLShamelOverTimeShateb';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelOverTimeShatebService {
  
  private RestUrl = 'https://localhost:44335/api/TBLShamelOverTimeShateb';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
 constructor(private httpClient : HttpClient) { }
  
    list()  {
     
      return this.httpClient.get<TBLShamelOverTimeShateb[]>(this.RestUrl ,this.httpOptions);  
      
    }

    Search(searchRequest : any,PageIndex:number, pageSize: number)  {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {  headers: headers };  
      return this.httpClient.post<{Item1: TBLShamelOverTimeShateb[], Item2: number}>(this.RestUrl +`/Search/`,{...searchRequest, pageNumber: PageIndex,pageSize: pageSize},this.httpOptions) as Observable<{Item1: TBLShamelOverTimeShateb[], Item2: number}>;  
      
    }

    CanDelete(serail:number)  {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {  headers: headers };  
      return this.httpClient.get<boolean>(this.RestUrl+`/CanDelete/${serail}` ,this.httpOptions);  
      
    }

    
  
  
    delete(id:number )  {
      return this.httpClient.delete<number>(this.RestUrl+`/${id}` ,this.httpOptions);  
    }
  
    add(obj : TBLShamelOverTimeShateb )  {
      return this.httpClient.post<number>(this.RestUrl ,obj,this.httpOptions);  
    }
  
    update(obj : TBLShamelOverTimeShateb )  {
      return this.httpClient.put<number>(this.RestUrl ,obj);  
    }

    isUniqueRecord(shateb : TBLShamelOverTimeShateb)  {
      return this.httpClient.post<TBLShamelOverTimeShateb[]>(this.RestUrl +`/isUniqueRecord`,shateb);        
    }
  
    statistics(obj : TBLShamelOverTimeStatistics )  {
      return this.httpClient.post<TblShamelOvertimePrintTotals[]>(this.RestUrl+`/Statistics` ,obj,this.httpOptions);  
    }
  }
  
