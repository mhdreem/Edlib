import { HttpHeaders, HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TBLShamelProgramTree } from '../../models/systemservice/TBLShamelProgramTree';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelProgramTreeService {
  public List_TBLShamelProgramTree:TBLShamelProgramTree[] = [];
  public List_TBLShamelProgramTree_BehaviorSubject:BehaviorSubject<TBLShamelProgramTree[]> = new BehaviorSubject<TBLShamelProgramTree[]>([]);

  
  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };

  constructor(private httpClient : HttpClient) { }

  list() :Observable<TBLShamelProgramTree[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<TBLShamelProgramTree[]>(this.RestUrl +"TBLShamelProgramTree",options) as Observable<TBLShamelProgramTree[]>;  
    
  }

  BuildTree() :Observable<TBLShamelProgramTree[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<TBLShamelProgramTree[]>(this.RestUrl +"TBLShamelProgramTree/BuildTree",options) as Observable<TBLShamelProgramTree[]>;      
  }




  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     return this.httpClient.get<TBLShamelProgramTree[]>(this.RestUrl +"TBLShamelProgramTree", options).subscribe
     (
      data=>
      {
        this.List_TBLShamelProgramTree = data;
        this.List_TBLShamelProgramTree_BehaviorSubject.next(this.List_TBLShamelProgramTree);

      }
     )
    
  }

  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +`TBLShamelProgramTree/${id}`,options);  
  }

  add(obj : TBLShamelProgramTree )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelProgramTree/",obj,options);  
  }

  update(obj : TBLShamelProgramTree )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +`TBLShamelProgramTree/${obj.serail}`,obj,options);  
  }

  
}
