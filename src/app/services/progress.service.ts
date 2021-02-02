import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  constructor(private http: HttpClient) {}

  createProgress(id: any): Observable<any> {
    console.log('crear progreso')
    return this.http.get(`${environment.URLAPI}/createProgreso/${id}`);
  }

  progressProgram(idUser: string, idProgram: string): Observable<any> {
    return this.http.get(
      `${environment.URLAPI}/progressProgram/${idUser}/${idProgram}`
    );
  }

  progressModule(idUser: string, idProgram: string): Observable<any> {
    return this.http.get(
      `${environment.URLAPI}/progressModule/${idUser}/${idProgram}`
    );
  }

  setRecurso(params): Observable<any> {
    return this.http.post(`${environment.URLAPI}/setProgressID`, params);
  }

  deleteProgress(params): Observable<any> {
    return this.http.post(`${environment.URLAPI}/deleteProgress`, params);
  }
}
