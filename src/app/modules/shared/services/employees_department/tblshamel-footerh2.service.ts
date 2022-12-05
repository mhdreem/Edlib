import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITBLShamelFooterH2 } from '../../models/employees_department/itblshamelFooterh2';

@Injectable({
  providedIn: 'root'
})
export class TblshamelFooterh2Service {

  public List_ITBLShamelFooterh2_BehaviorSubject:BehaviorSubject<ITBLShamelFooterH2[]> = new BehaviorSubject<ITBLShamelFooterH2[]>([]);

  public List_ITBLShamelFooterh2 :ITBLShamelFooterH2[]=[];


  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list() :Observable<ITBLShamelFooterH2[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<ITBLShamelFooterH2[]>(this.RestUrl +"TblShamelFooterH2/",options) as Observable<ITBLShamelFooterH2[]>;  
    
  }
  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     this.httpClient.get<ITBLShamelFooterH2[]>(this.RestUrl +"TblShamelFooterH2/",options).subscribe
     (
      data=>
      {
        this. List_ITBLShamelFooterh2 = data;
        this.List_ITBLShamelFooterh2_BehaviorSubject.next(data);
      }
     )
    
  }

  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"TblShamelFooterH2/"+id,options);  
  }

  add(obj : ITBLShamelFooterH2 )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TblShamelFooterH2/",obj,options);  
  }

  update(obj : ITBLShamelFooterH2 )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"TblShamelFooterH2/"+obj.footerh2_id,obj,options);  
  }
}
