import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  reporteUsuario(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/reporteUsuario`);
  }

  reporteMatricula(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/reporteMatricula`);
  }

  reporteActividad(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/matriculas`);
  }
}


