import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaging } from '../../models/employees_department/ipaging';
import { ITBLShamelJobName } from '../../models/employees_department/ITBLShamelJobName';
import { ITBLShamelUpgradeJobState } from '../../models/employees_department/itblshamelUpgradeJobState';
import { AddUpgradeToAllEmployeeRequest } from '../../models/employees_department/tblshamelupgrade_help/add-upgrade-to-all-employee-request';
import { CountEmployeeAndQararRequest } from '../../models/employees_department/tblshamelupgrade_help/CountEmployeeAndQararRequest';
import { CountEmployeeAndQararResponse } from '../../models/employees_department/tblshamelupgrade_help/CountEmployeeAndQararResponse';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelUpgradeService {

  private RestUrl = 'https://localhost:44335/api/';

  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
  };
 
  constructor(private httpClient : HttpClient) { }

  PrepareAll(obj:any)  {
    console.log(obj);
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelUpgrade/AddUpgradeToAllEmployee",obj,options);      
  }


  list(obj:any): Observable<IPaging>  {
    console.log(obj);
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelUpgrade/List",obj,options) as Observable<IPaging>;      
  }


  CountEmployeeAndQarar(Reuest:CountEmployeeAndQararRequest)  {

    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post<CountEmployeeAndQararResponse>(this.RestUrl +"TBLShamelUpgrade/CountEmployeeAndQarar", Reuest,options);      
  }
  
    Get_Upgrade_Max_Qarar_Num (year_id?:number)  {

    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +`TBLShamelUpgrade/Get_Upgrade_Max_Qarar_Num/${year_id}`,options) as Observable<number>;      
  }

  AddUpgradeToAllEmployee(Reuest:AddUpgradeToAllEmployeeRequest)  {

    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post<CountEmployeeAndQararResponse>(this.RestUrl +"TBLShamelUpgrade/AddUpgradeToAllEmployee", Reuest,options);      
  }

  UpgradeJobState(Reuest:ITBLShamelUpgradeJobState, blocked: number, yearId: number)  {

    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelUpgrade/Upgrade_JobState/"+blocked+'/'+yearId, Reuest,options);      
  }

  Prepare_PrintUpgradeQararV(obj:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelUpgrade/Prepare_Print_UpgradeQararV",obj,options);      
  }

  TBLShamelUpgrade_Delete_Data(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
    const options = {  headers: headers };  
    return this.httpClient.post(this.RestUrl +"TBLShamelUpgrade/TBLShamelUpgrade_Delete_Data",options);      
  }
}
