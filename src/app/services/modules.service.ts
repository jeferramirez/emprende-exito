import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private http: HttpClient) { }

  createModule(module: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/modulos`, module);
  }

  getModules(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/listaModulos/${id}`);
  }

  deleteModule(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/deleteModule/${id}`);
  }

  getModule(id: any): Observable<any> {
    return this.http.get(`${environment.URLAPI}/modulos/${id}`);
  }

  updateModule(module: any, id: number): Observable<any> {
    return this.http.put(
      `${environment.URLAPI}/modulos/${id}`,
      module
    );
  }


}
