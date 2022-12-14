import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TBLShamelDaera } from '../../models/employees_department/TBLShamelDaera';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelDaeraService {

  public List_TBLShamelDaera:TBLShamelDaera[] = [];
  public List_TBLShamelDaera_BehaviorSubject:BehaviorSubject<TBLShamelDaera[]> = new BehaviorSubject<TBLShamelDaera[]>([]);


  private RestUrl = 'https://localhost:44335/api/';

  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
  };
 
  constructor(private httpClient : HttpClient) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"TBLShamelDaera",options);      
  }

  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     this.httpClient.get<TBLShamelDaera[]>(this.RestUrl +"TBLShamelDaera",options).subscribe
     (
      data =>
      {
        this.List_TBLShamelDaera = data;
        this.List_TBLShamelDaera_BehaviorSubject.next(data);
      }
     )      
  }


  delete(Daera_ID:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"TBLShamelDaera/delete/"+Daera_ID,options);  
  }

  add(obj :  TBLShamelDaera )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TBLShamelDaera/",obj,options);  
  }

  update(obj :  TBLShamelDaera )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"TBLShamelDaera/"+obj.daera_id,obj,options);  
  }

}
