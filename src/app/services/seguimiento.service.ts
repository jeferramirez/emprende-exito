import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  constructor(private http: HttpClient) {}


  createSeguimiento(seguimiento: any): Observable<any> {
    console.log(seguimiento);
    return this.http.post(`${environment.URLAPI}/ficha-seguimientos`, seguimiento);
  }

  getSeguimiento(idUser: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/ficha-seguimientos/user/${idUser}`);
  }

  updateSeguimiento(idUser: string, seguimiento: any): Observable<any> {
    return this.http.put(`${environment.URLAPI}/ficha-seguimientos/${idUser}`, seguimiento);
  }

}
