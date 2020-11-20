import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  constructor(private http: HttpClient) { }


  getMatriculas(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/matriculas`);
  }

  createMatricula(matricula): Observable<any> {
    return this.http.post(`${environment.URLAPI}/matriculas`, matricula);
  }

  deleteMatricula(idMatricula): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/matriculas/${idMatricula}`);
  }

  getUserMatricula(id): Observable<any> {
    return this.http.get(`${environment.URLAPI}/getUserMatricula/${id}`);
  }
}
