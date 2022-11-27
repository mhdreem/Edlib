import { HttpHeaders, HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITBLShamelSCHealthHoliday } from '../../models/employees_department/ITBLShamelSCHealthHoliday';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelSCHealthHolidayService {
  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list(id:number)  {
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"TBLShamelSCHealthHoliday/"+id,options);  
    
  }


  delete(serial:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.delete("https://localhost:44335/api/TBLShamelSCHealthHoliday/"+serial);
  }


  add(obj : ITBLShamelSCHealthHoliday )  {
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});  
    const options = { headers: headers }; 
    console.log("post", obj);   
    return this.httpClient.post("https://localhost:44335/api/TBLShamelSCHealthHoliday",obj,options); 

  }

  update(obj : ITBLShamelSCHealthHoliday )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    console.log(this.RestUrl +"TBLShamelSCHealthHoliday/"+obj.serial);
    return this.httpClient.put(this.RestUrl +"TBLShamelSCHealthHoliday/"+obj.serial,obj,options);
  }

  
  Validate(obj : ITBLShamelSCHealthHoliday ) :Observable<ITBLShamelSCHealthHoliday[]>  {
    return this.httpClient.post<ITBLShamelSCHealthHoliday[]>(this.RestUrl +"TBLShamelSCHealthHoliday/Validate",obj);
  }
  
}
