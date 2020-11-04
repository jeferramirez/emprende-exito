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
}
