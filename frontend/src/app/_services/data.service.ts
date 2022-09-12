import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  _headers: HttpHeaders;
  _apiBaseUrl: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this._headers = new HttpHeaders().set('content-type', 'application/json');
    this._apiBaseUrl = environment.APIBASEURL;
  }

  // getting all record from api
  getAll(): Observable<any> {
    return this.httpClient.get(this._apiBaseUrl + '?action=getAllRecord', { headers: this._headers });
  }

  /*
  calling store record api
  @param record object
  */
  store(obj: any): Observable<any> {
    return this.httpClient.post(this._apiBaseUrl + '?action=saveRecord', obj, { headers: this._headers });
  }

  /*
  calling update record api
  @param record object & record id
  */
  update(obj: any, id: number): Observable<any> {
    return this.httpClient.post(this._apiBaseUrl + '?action=updateRecord&id='+id, obj, { headers: this._headers });
  }
  
  /*
  calling delete record api
  @param record id
  */
  delete(ids: Array<any>): Observable<any> {
    return this.httpClient.post(this._apiBaseUrl + '?action=deleteRecord&ids=' + decodeURIComponent(ids.toString()), { headers: this._headers });
  }
}
