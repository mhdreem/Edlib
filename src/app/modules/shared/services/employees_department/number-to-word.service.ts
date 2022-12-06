import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NumberToWordService {

  private RestUrl = 'https://localhost:44335/api/';
  constructor(private httpClient : HttpClient) { }

  getWrittenNumber(number: number): Observable<string>  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get<string>(this.RestUrl +"NumberToWord/ToWord/"+number,options);  
    
  }
}
