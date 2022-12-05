import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITBLShamelFooterH1 } from '../../models/employees_department/itblshamelFooterh1';

@Injectable({
  providedIn: 'root'
})
export class TblshamelFooterh1Service {

  public List_ITBLShamelFooterh1_BehaviorSubject:BehaviorSubject<ITBLShamelFooterH1[]> = new BehaviorSubject<ITBLShamelFooterH1[]>([]);

  public List_ITBLShamelFooterh1 :ITBLShamelFooterH1[]=[];


  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list() :Observable<ITBLShamelFooterH1[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<ITBLShamelFooterH1[]>(this.RestUrl +"TblShamelFooterH1/",options) as Observable<ITBLShamelFooterH1[]>;  
    
  }
  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     this.httpClient.get<ITBLShamelFooterH1[]>(this.RestUrl +"TblShamelFooterH1/",options).subscribe
     (
      data=>
      {
        this. List_ITBLShamelFooterh1 = data;
        this.List_ITBLShamelFooterh1_BehaviorSubject.next(data);
      }
     )
    
  }

  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"TblShamelFooterH1/"+id,options);  
  }

  add(obj : ITBLShamelFooterH1 )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TblShamelFooterH1/",obj,options);  
  }

  update(obj : ITBLShamelFooterH1 )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"TblShamelFooterH1/"+obj.footerh1_id,obj,options);  
  }

}
