import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  headerDict = {
    'Content-Type': 'multipart/form-data',
  };

  requestOptions = {
    headers: new Headers(this.headerDict),
  };


  constructor( private http: HttpClient) { }

  createProgram(program: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/programas`, program);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/programas`);
  }

  deleteProgram(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/programas/${id}`);
  }
}
