import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TblShamelPayrolSlice } from '../../../models/finance_department/payrol/tblShamelPayrolSlice';

@Injectable({
  providedIn: 'root'
})
export class TblshamelPayrolSliceService {

  public List_payrolSlice:TblShamelPayrolSlice[] = [];

  public List_payrolSlice_BehaviorSubject:BehaviorSubject<TblShamelPayrolSlice[]> = new BehaviorSubject<TblShamelPayrolSlice[]>([]);



  private RestUrl = 'https://localhost:44335/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list() :Observable<TblShamelPayrolSlice[]>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<TblShamelPayrolSlice[]>(this.RestUrl +"TblShamelPayrolSlice",options);  
    
  }

  getLastInThisSlice(accounterId: number, sliceFrom: number, sliceTo: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"TblShamelPayrolSlice/GetLastInThisSlice/"+accounterId+'/'+sliceFrom+'/'+sliceTo,options);  
  }

}
