import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITBLShamelDocumentType } from '../../models/employees_department/ITBLShamelDocumentType';
import { TBLShamelSex } from '../../models/employees_department/TBLShamelSex';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelSexService {

  List_TBLShamelSex :TBLShamelSex[];
  public List_TBLShamelSex_BehaviorSubject:BehaviorSubject<TBLShamelSex[]> = new BehaviorSubject<TBLShamelSex[]>([]);




  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list() :Observable<TBLShamelSex[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    console.log("TBLShamelSex");
    return this.httpClient.get<TBLShamelSex[]>(this.RestUrl +"TBLShamelSex/list",options);    
  }

  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    console.log("TBLShamelSex");
     this.httpClient.get<TBLShamelSex[]>(this.RestUrl +"TBLShamelSex/list",options).subscribe(
       data=> 
       {this.List_TBLShamelSex = data;
        this.List_TBLShamelSex_BehaviorSubject.next(data);
      }
     ) 
  }


  delete(Sex_ID:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"TBLShamelSex/delete/"+Sex_ID,options);  
  }

  add(obj : TBLShamelSex )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelSex/",obj,options);  
  }

  update(obj : TBLShamelSex )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"TBLShamelSex/"+obj.Sex_ID,obj,options);  
  }

}
