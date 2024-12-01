import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../../../services/base-default.service'; 
import { ResponseResult } from '../../../modules/response-result';
@Injectable({
  providedIn: 'root'
})
export class TaoPhieuNhap1Service extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/TaoPhieuNhaps`);
  }
   
  Gets(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
 
  Save(d: any): Observable<any> {
    return this._http.put<any>(`${environment.URL_API1}/TaoPhieuNhaps`, d)
  } 
  GetNCC(){
    return this._http.get(`${environment.URL_API1}/NhaCungCap`);
  }

  

}
