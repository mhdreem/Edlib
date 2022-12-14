import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITBLShamelSCFreeHoliday } from '../../models/employees_department/ITBLShamelSCFreeHoliday';
import { TBLShamelSuddenHoliday } from '../../models/employees_department/TBLShamelSuddenHoliday';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelSuddenHolidayService {


  List_TBLShamelSuddenHolidayService ?:TBLShamelSuddenHoliday[]=[];
  List_TBLShamelSuddenHolidayService_BehaviorSubject ?: BehaviorSubject< TBLShamelSuddenHoliday[]>= new  BehaviorSubject< TBLShamelSuddenHoliday[]>([]);

  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list()  {
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    const options = {  headers: headers };  
    return this.httpClient.get<TBLShamelSuddenHoliday[]>(this.RestUrl +`TBLShamelSuddenHoliday`,options) as Observable<TBLShamelSuddenHoliday[]>;  
    
  }


  fill()  {
this.list().subscribe(data=>
  {
    console.log(data);
    this.List_TBLShamelSuddenHolidayService = data;
    this.List_TBLShamelSuddenHolidayService_BehaviorSubject.next(this.List_TBLShamelSuddenHolidayService);
  })
    
  }


  delete(suddenholiday_id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.delete("https://localhost:44335/api/TBLShamelSuddenHoliday/"+suddenholiday_id);
  }


  add(obj : ITBLShamelSCFreeHoliday )  {
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});  
    const options = { headers: headers };    
    return this.httpClient.post("https://localhost:44335/api/TBLShamelSuddenHoliday",obj,options); 

  }

  update(obj : TBLShamelSuddenHoliday )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"TBLShamelSuddenHoliday/"+obj.suddenholiday_id,obj,options);
  }

}



