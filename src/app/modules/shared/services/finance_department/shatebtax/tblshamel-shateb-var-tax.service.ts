import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TBLShamelEmployee } from '../../../models/employees_department/TBLShamelEmployee';
import { TBLShamelShatebPunishment } from '../../../models/finance_department/shatebtax/TBLShamelShatebPunishment';

import { TBLShamelShatebVartax } from '../../../models/finance_department/shatebtax/TBLShamelShatebVartax';
import { TBLShamelShatebVartaxRequest } from '../../../models/finance_department/shatebtax/TBLShamelShatebVartaxRequest';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelShatebVarTaxService {

  public List_TblShamelVarTaxService:TBLShamelShatebVartax[] = [];

  public List_TblShamelVarTaxServicet_BehaviorSubject:BehaviorSubject<TBLShamelShatebVartax[]> = new BehaviorSubject<TBLShamelShatebVartax[]>([]);
 
  private RestUrl = 'https://localhost:44335/api/';
 
  constructor(private httpClient : HttpClient) { }

  list(obj: TBLShamelShatebVartaxRequest)  {
   
    return this.httpClient.post<{Item1: any[], Item2: number}>(this.RestUrl +"TBLShamelShatebVarTax/Search",obj) as Observable<{Item1: any[], Item2: number}>;  
    
  }

  isUniqueRecord(id:number,documentnum:string,startdate:Date, documentdate:Date,serial?:number) :Observable<TBLShamelShatebVartax[]> 
  {
    
    let Request =
    {
      id:id,
      documentnum:documentnum,
      startdate:startdate,
      documentdate:documentdate,
      serial:serial
    }
    return this.httpClient.post<TBLShamelShatebVartax[]>(this.RestUrl +"TBLShamelShatebVarTax/isUniqueRecord",Request);  
    
  }

  fill(obj: TBLShamelShatebVartaxRequest)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     return this.httpClient.post<TBLShamelShatebVartax[]>(this.RestUrl +"TBLShamelShatebVartax/Search", obj, options).subscribe
     (
      data=>
      {
        this.List_TblShamelVarTaxService = data;
        this.List_TblShamelVarTaxServicet_BehaviorSubject.next(this.List_TblShamelVarTaxService);
      }
     )
    
  }

  delete(id:number )  {
   
    return this.httpClient.delete(this.RestUrl +"TBLShamelShatebVarTax/"+id) as Observable<TBLShamelShatebVartaxRequest>;  
  }

  add(obj : TBLShamelShatebVartax )  {
    return this.httpClient.post(this.RestUrl +"TBLShamelShatebVarTax/Add/",obj);  
  }

  update(obj : TBLShamelShatebVartax )  {
    return this.httpClient.put(this.RestUrl +`TBLShamelShatebVarTax/update/${obj.serial}`,obj) as Observable<TBLShamelShatebVartaxRequest>;  
  }

  search(obj : TBLShamelShatebVartaxRequest )  {
    console.log('obj', obj);
    return this.httpClient.post<{Item1: any[], Item2: number}>(this.RestUrl +"TBLShamelShatebVarTax/Search",obj)as Observable<{Item1: any[], Item2: number}>;  
  }


  Get_By_ID_Month_Year(id: number, yearId: string, monthId: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    console.log('res1');

    return this.httpClient.get(this.RestUrl+"TBLShamelShatebHealth/Get_By_ID_Month_Year?ID="+id+"&Year_ID="+yearId+"&Month_ID="+monthId, options);
  }
}
