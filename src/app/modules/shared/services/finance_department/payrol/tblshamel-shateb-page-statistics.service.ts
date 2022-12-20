import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TBLShamelShatebPageStatisticsService {
  private RestUrl = 'https://localhost:44335/api/';

  constructor(private httpClient : HttpClient) { }

  list(id:number,year_id:number)  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +`TBLShamelShatebPageStatistics/list/${id}/${year_id}`,options);      
  }
}
